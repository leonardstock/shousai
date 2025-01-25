import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
    try {
        const { amount, planId } = await req.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: "gbp",
            payment_method_types: ["card"],
            metadata: {
                planId,
                integration_check: "accept_a_payment",
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Payment Intent Error:", error);
        return NextResponse.json(
            { error: "Payment processing failed" },
            { status: 500 }
        );
    }
}
