/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
    downgradeUserSubscription,
    upgradeUserSubscription,
} from "@/actions/subscriptions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }
    try {
        switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const customer = (await stripe.customers.retrieve(
                    customerId
                )) as Stripe.Customer;

                if (!customer.email) {
                    throw new Error(
                        `No email found for Stripe customer ${customerId}`
                    );
                }

                const user = await prisma.user.findFirst({
                    where: { email: customer.email },
                    include: {
                        organization: true,
                    },
                });

                if (!user) {
                    throw new Error(
                        `No user found for Stripe customer ${customerId}`
                    );
                }

                if (subscription.status === "active") {
                    if (user.organizationId) {
                        await upgradeUserSubscription(
                            user.organizationId,
                            customerId,
                            subscription.id
                        );
                    }
                }

                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // Get customer email from Stripe
                const customer = (await stripe.customers.retrieve(
                    customerId
                )) as Stripe.Customer;
                if (!customer.email) {
                    throw new Error(
                        `No email found for Stripe customer ${customerId}`
                    );
                }

                // Find user by email
                const user = await prisma.user.findFirst({
                    where: { email: customer.email },
                    include: {
                        organization: true,
                    },
                });

                if (user && user.organizationId) {
                    await downgradeUserSubscription(user.organizationId);
                }
                break;
            }
            // case "invoice.payment_succeeded":
            //     const invoice = event.data.object as Stripe.Invoice;
            //     // Handle successful payment
            //     console.log("Payment succeeded for invoice:", invoice.id);
            //     break;
            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                const subscriptionId = invoice.subscription as string;

                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscriptionId },
                    data: { status: "past_due" },
                });
                break;
            }
            default:
            // console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing Stripe webhook:", error);
        return NextResponse.json(
            { error: "Error processing webhook" },
            {
                status: 500,
            }
        );
    }
}
