import Footer from "@/components/layout/Footer";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className='flex flex-col min-h-screen bg-white'>
            {/* Header */}
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center'>
                <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6'>
                    Flexible Pricing for Every Team
                </h1>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                    Choose a plan that fits your needs and scale as you grow.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className='flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {/* Free Tier */}
                    <div className='border rounded-lg p-8 text-center bg-gray-50 shadow-md'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                            Free Tier
                        </h2>
                        <p className='text-gray-600 mb-6'>
                            Get started with basic features for free.
                        </p>
                        <div className='text-4xl font-bold text-gray-900 mb-6'>
                            £0
                            <span className='text-lg font-medium'>/month</span>
                        </div>
                        <ul className='text-gray-600 space-y-2 mb-6'>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Up to 5 team members
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Up to 1000$ AI spend
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Basic cost tracking
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Email alerts
                            </li>
                        </ul>
                        <Link href='/'>
                            <button className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700'>
                                Get Started
                            </button>
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className='relative border rounded-lg p-10 text-center bg-white shadow-lg transform scale-105'>
                        <div className='absolute inset-x-0 top-0 -translate-y-1/2 mx-auto w-fit px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-medium'>
                            Most Popular
                        </div>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                            Pro Tier
                        </h2>
                        <p className='text-gray-600 mb-6'>
                            Perfect for growing teams that need advanced tools.
                        </p>
                        <div className='text-4xl font-bold text-gray-900 mb-6'>
                            £200
                            <span className='text-lg font-medium'>/month</span>
                        </div>
                        <ul className='text-gray-600 space-y-2 mb-6'>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Up to 10 team members
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Up to 10,000$ AI spend
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                All optimization tools
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Real-time alerts
                            </li>
                        </ul>
                        <Link href='/'>
                            <button className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700'>
                                Upgrade Now
                            </button>
                        </Link>
                    </div>

                    {/* Enterprise Tier */}
                    <div className='border rounded-lg p-8 text-center bg-gray-50 shadow-md'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                            Enterprise Tier
                        </h2>
                        <p className='text-gray-600 mb-6'>
                            Tailored solutions for large organizations.
                        </p>
                        <div className='text-4xl font-bold text-gray-900 mb-6'>
                            Custom
                            <span className='text-lg font-medium'>/month</span>
                        </div>
                        <ul className='text-gray-600 space-y-2 mb-6'>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Custom Limits
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Dedicated support
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Custom features
                            </li>
                        </ul>
                        <Link href='/'>
                            <button className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700'>
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
