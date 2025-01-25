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
import axios from "axios";
import { SubscriptionTier } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import {
    downgradeUserSubscription,
    getSubscriptionTier,
    upgradeUserSubscription,
} from "@/app/actions";
import { upgradeDisabled } from "@/global";

// Stripe initialization
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Payment Form Component
const PaymentForm = ({
    planPrice,
    planId,
    onSubscriptionChange,
}: {
    planPrice: number;
    planId: string;
    onSubscriptionChange: () => void;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    const userName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        try {
            if (planId === "FREE") {
                await axios.delete("/api/v1/subscriptions/complete", {
                    params: {
                        userEmail: user!.emailAddresses[0].emailAddress,
                    },
                });

                downgradeUserSubscription(user!.id);

                onSubscriptionChange();
            } else {
                // Create payment intent
                const { data } = await axios.post(
                    "/api/v1/payments/create-intent",
                    {
                        amount: planPrice,
                        planId,
                    }
                );

                // Confirm card payment
                const result = await stripe.confirmCardPayment(
                    data.clientSecret,
                    {
                        setup_future_usage: "off_session",
                        payment_method: {
                            card: elements.getElement(CardElement)!,
                            billing_details: {
                                name: userName,
                            },
                        },
                    }
                );

                if (result.error) {
                    setError(result.error.message || "Payment failed");
                    setLoading(false);
                    return;
                }

                // Complete subscription
                await axios.post("/api/v1/subscriptions/complete", {
                    paymentIntentId: result.paymentIntent?.id,
                    planId,
                    user,
                });

                upgradeUserSubscription(user!.id);

                onSubscriptionChange();
            }
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
                {loading
                    ? "Processing..."
                    : planId === "PRO"
                    ? "Upgrade"
                    : "Downgrade"}
            </button>
        </form>
    );
};

// Subscription Page
export default function SubscriptionPage() {
    const [currentTier, setCurrentTier] = useState<SubscriptionTier>();
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    const handleSubscriptionTierLoad = async (userId: string) => {
        setLoading(true);
        const subscriptionTier = await getSubscriptionTier(userId);
        setCurrentTier(subscriptionTier!);
        setLoading(false);
    };

    useEffect(() => {
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

                        {plan.id !== currentTier && !loading && (
                            <Elements stripe={stripePromise}>
                                <PaymentForm
                                    planPrice={plan.price}
                                    planId={plan.id}
                                    onSubscriptionChange={() =>
                                        handleSubscriptionTierLoad(user!.id)
                                    }
                                />
                            </Elements>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
