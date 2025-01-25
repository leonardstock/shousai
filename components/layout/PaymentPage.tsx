/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SubscriptionTier } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { getSubscriptionTier } from "@/app/actions";
import { upgradeDisabled } from "@/global";

// Stripe initialization
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Payment Form Component
const PaymentForm = ({
    planPrice,
    planId,
}: {
    planPrice: number;
    planId: string;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        try {
            // Create payment intent
            const { data } = await axios.post(
                "/api/v1/payments/create-intent",
                {
                    amount: planPrice,
                    planId,
                }
            );

            // Confirm card payment
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        name: "Customer Name", // TODO: Collect actual customer name
                    },
                },
            });

            if (result.error) {
                setError(result.error.message || "Payment failed");
                setLoading(false);
                return;
            }

            // Complete subscription
            await axios.post("/api/v1/subscriptions/complete", {
                paymentIntentId: result.paymentIntent?.id,
                planId,
            });

            // Redirect to dashboard or show success
            router.push("/dashboard");
        } catch (err: any) {
            setError(
                err.response?.data?.error || "An unexpected error occurred"
            );
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                                color: "#aab7c4",
                            },
                        },
                        invalid: {
                            color: "#9e2146",
                        },
                    },
                }}
            />
            {error && <div className='text-red-500 text-sm'>{error}</div>}
            <button
                type='submit'
                disabled={loading || !stripe || upgradeDisabled}
                className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400'>
                {loading ? "Processing..." : "Upgrade"}
            </button>
        </form>
    );
};

// Subscription Page
export default function SubscriptionPage() {
    const [currentTier, setCurrentTier] = useState<SubscriptionTier>("FREE");
    const { user } = useUser();

    useEffect(() => {
        const handleSubscriptionTierLoad = async (userId: string) => {
            const subscriptionTier = await getSubscriptionTier(userId);
            setCurrentTier(subscriptionTier!);
        };

        if (user) {
            handleSubscriptionTierLoad(user.id);
        }
    }, [user]);

    const plans = [
        {
            id: "FREE",
            name: "Free Tier",
            price: 0,
            features: [
                "Up to 1000$ AI spend",
                "Basic cost tracking",
                "Email alerts",
            ],
        },
        {
            id: "PRO",
            name: "Pro Tier",
            price: 200,
            features: [
                "Up to 10,000$ AI spend",
                "All optimization tools",
                "Real-time alerts",
            ],
        },
    ];

    return (
        <div className='container mx-auto p-6 max-w-2xl'>
            <h1 className='text-2xl font-bold mb-6'>Choose Your Plan</h1>

            <div className='grid md:grid-cols-2 gap-6'>
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`border rounded-lg p-6 shadow-md relative ${
                            plan.id === currentTier
                                ? "border-2 border-blue-500 shadow-lg"
                                : "border"
                        }`}>
                        {plan.id === currentTier && (
                            <div className='absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm'>
                                Current Plan
                            </div>
                        )}
                        <h2 className='text-xl font-semibold mb-4'>
                            {plan.name}
                        </h2>
                        <p className='text-2xl font-bold mb-4'>
                            £{plan.price}/month
                        </p>

                        <ul className='mb-6 space-y-2'>
                            {plan.features.map((feature) => (
                                <li key={feature} className='flex items-center'>
                                    <svg
                                        className='w-5 h-5 text-green-500 mr-2'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'>
                                        <path
                                            fillRule='evenodd'
                                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {plan.id !== currentTier && (
                            <Elements stripe={stripePromise}>
                                <PaymentForm
                                    planPrice={plan.price}
                                    planId={plan.id}
                                />
                            </Elements>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
