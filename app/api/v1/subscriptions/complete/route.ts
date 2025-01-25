import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

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
        });

        // Create Subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price: `price_${planId}`, // Stripe price ID
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
