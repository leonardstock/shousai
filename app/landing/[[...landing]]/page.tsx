"use client";

import Footer from "@/components/layout/Footer";
import { ArrowRight, LineChart, Shield, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export default function LandingPage() {
    const handleSubmit = async () => {
        redirect("/signup");
    };

    return (
        <div className='min-h-screen bg-white'>
            {/* Hero Section */}
            <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
                <div className='text-center'>
                    <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6'>
                        Reduce Your AI Costs
                    </h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-8'>
                        Monitor and optimize your AI spending across OpenAI,
                        Anthropic, and other providers. Get real-time alerts and
                        intelligent optimization suggestions.
                    </p>

                    <div className='max-w-md mx-auto'>
                        <div className='flex flex-col md:flex-row items-center justify-center'>
                            <button
                                onClick={handleSubmit}
                                className='px-6 py-2 background-gradient bg-white text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 justify-center'>
                                Get Early Access
                                <ArrowRight className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Proof */}
            <div className='bg-gray-50 py-12'>
                <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <p className='text-center text-gray-600 mb-8'>
                        Companies using AI are spending thousands on API calls
                    </p>
                    <div className='grid grid-cols-1 gap-8 text-center'>
                        <div>
                            <div className='text-3xl font-bold text-gray-900'>
                                $5,000+
                            </div>
                            <div className='text-gray-600'>
                                Average Monthly AI Spend
                            </div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-gray-900'>
                                Varies depending on usage patterns
                            </div>
                            <div className='text-gray-600'>
                                Average Cost Reduction
                            </div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-gray-900'>
                                In minutes
                            </div>
                            <div className='text-gray-600'>Setup Time</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                    <div className='text-center'>
                        <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4'>
                            <LineChart className='w-6 h-6 text-blue-600' />
                        </div>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                            Real-time Monitoring
                        </h3>
                        <p className='text-gray-600'>
                            Track costs across all AI providers in one dashboard
                        </p>
                    </div>

                    <div className='text-center'>
                        <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4'>
                            <Zap className='w-6 h-6 text-blue-600' />
                        </div>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                            Smart Optimization
                        </h3>
                        <p className='text-gray-600'>
                            {/* Automatic suggestions to reduce costs without
                        affecting performance */}
                            Intelligent caching to reduce costs and time to
                            answer without affecting quality
                        </p>
                    </div>

                    <div className='text-center'>
                        <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4'>
                            <Shield className='w-6 h-6 text-blue-600' />
                        </div>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                            Budget Controls
                        </h3>
                        <p className='text-gray-600'>
                            Set limits and get alerts before costs get out of
                            hand
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className='bg-blue-50 py-16'>
                <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                        Ready to optimize your AI costs?
                    </h2>
                    <p className='text-gray-600 mb-8'>
                        Join the beta program now!
                    </p>
                    <button
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className='px-8 py-3 background-gradient text-white rounded-lg font-medium hover:bg-blue-700'>
                        Get Started
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
