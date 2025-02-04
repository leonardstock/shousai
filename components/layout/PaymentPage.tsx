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
import LoadingIndicator from "../shared/LoadingIndicator";

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
                "Small projects",
                "Basic cost tracking",
                "Caching optimization",
                "Email alerts",
            ],
        },
        {
            id: "PRO",
            name: "Pro Tier",
            price: 200,
            features: [
                "Up to 5 team members",
                "Cost Tracking",
                "All optimization tools",
                "Real-time alerts",
            ],
        },
    ];

    return (
        <div className='container mx-auto p-6 max-w-2xl'>
            <div className='flex items-center gap-2 mb-6'>
                <h2 className='text-2xl font-semibold'>Manage Subscription</h2>
                {loading && <LoadingIndicator />}
            </div>

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

            <div>
                <div className='max-w-screen-xl mx-auto my-10'>
                    <div className='border rounded-lg text-center bg-white shadow-md overflow-auto'>
                        <table className='w-full border-collapse rounded-lg '>
                            <thead>
                                <tr className='bg-gray-100 text-gray-700'>
                                    <th className='py-4 px-6 text-left'>
                                        Features
                                    </th>
                                    <th className='py-4 px-6 text-center'>
                                        Free
                                    </th>
                                    <th className='py-4 px-6 text-center border-t-2  border-x-2 border-blue-600'>
                                        Pro
                                    </th>
                                    <th className='py-4 px-6 text-center'>
                                        Enterprise
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='border-t border-gray-200'>
                                    <td className='py-4 px-6 text-left'>
                                        Daily API Calls*
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        50
                                    </td>
                                    <td className='py-4 px-6 text-center border-x-2 border-blue-600'>
                                        1000
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        Unlimited
                                    </td>
                                </tr>
                                <tr className='border-t border-gray-200'>
                                    <td className='py-4 px-6 text-left'>
                                        Monthly API Calls*
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        500
                                    </td>
                                    <td className='py-4 px-6 text-center border-x-2 border-blue-600'>
                                        10,000
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        Unlimited
                                    </td>
                                </tr>
                                <tr className='border-t border-gray-200'>
                                    <td className='py-4 px-6 text-left'>
                                        Team members
                                    </td>
                                    <td className='py-4 px-6 text-center'>1</td>
                                    <td className='py-4 px-6 text-center border-x-2 border-b-2 border-blue-600'>
                                        5
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        Custom
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <div className='max-w-screen-xl mx-auto mb-10'>
                    <p className='border rounded-lg p-4 text-bold shadow-md'>
                        *Note: The limitations in API calls only apply to the
                        service shousai provides. Your API calls to OpenAI and
                        Anthropic models are still going through, but will not
                        be included in your dashboard overview or optimised.
                    </p>
                </div>
            </div>
        </div>
    );
}
