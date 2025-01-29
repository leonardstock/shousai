import { SubscriptionTier } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

const priceMapping: Record<SubscriptionTier, string> = {
    FREE: "price_1QkUeeF2dPz4IehQEx3dSV0C",
    PRO: "price_1QkUfwF2dPz4IehQOSu5b2Ol",
    ENTERPRISE: "",
};

export async function POST(req: NextRequest) {
    try {
        const { paymentIntentId, planId, user } = await req.json();

        // Verify payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
        );

        // Create Stripe Customer
        const customer = await stripe.customers.create({
            email: user.emailAddresses[0].emailAddress,
            payment_method: paymentIntent.payment_method as string,
            name: `${user.firstName} ${user.lastName}`,
        });

        // Create Subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            default_payment_method: paymentIntent.payment_method as string,
            items: [
                {
                    price: priceMapping[planId as SubscriptionTier],
                },
            ],
            expand: ["latest_invoice.payment_intent"],
        });
        return NextResponse.json({
            subscriptionId: subscription.id,
            status: subscription.status,
        });
    } catch (error) {
        console.error("Subscription Error:", error);
        return NextResponse.json(
            { error: "Subscription creation failed" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const userEmail = req.nextUrl.searchParams.get("userEmail")!;

        const customer = await stripe.customers.list({
            limit: 1,
            email: userEmail,
        });

        const subscriptions = await stripe.subscriptions.list({
            limit: 1,
            customer: customer.data[0].id,
            status: "active",
        });

        const subscription = await stripe.subscriptions.cancel(
            subscriptions.data[0].id
        );

        return NextResponse.json({
            subscriptionId: subscription.id,
            status: subscription.status,
        });
    } catch (error) {
        console.error("Payment Intent Error:", error);
        return NextResponse.json(
            { error: "Payment processing failed" },
            { status: 500 }
        );
    }
}
