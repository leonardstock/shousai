"use client";

import Footer from "@/components/layout/Footer";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function PricingPage() {
    return (
        <div className='flex flex-col min-h-screen bg-white'>
            {/* Header */}
            <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center'>
                <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6'>
                    Flexible Pricing for Every Team
                </h1>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                    Choose a plan that fits your needs and scale as you grow.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className='flex-grow max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
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
                                Perfect for small projects
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
                        <Link href='/signup'>
                            <button className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700'>
                                Get Started
                            </button>
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className='relative border rounded-lg p-10 text-center bg-white shadow-lg transform scale-105'>
                        {/* <div className='absolute inset-x-0 top-0 -translate-y-1/2 mx-auto w-fit px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-medium'>
                            Most Popular
                        </div> */}
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
                                All optimization tools
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='w-5 h-5 text-green-500' />
                                Real-time alerts
                            </li>
                        </ul>
                        <Link href='/signin'>
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
                        <button
                            className='px-6 py-3 mt-5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700'
                            onClick={() =>
                                redirect("mailto:support@shousai.co.uk")
                            }>
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <div className='max-w-screen-xl mx-auto my-10 px-4 sm:px-6 lg:px-8'>
                    <div className='border rounded-lg text-center bg-white shadow-md'>
                        <table className='w-full border-collapse rounded-lg'>
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
                                        Daily API Calls
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
                                        Monthly API Calls
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
                                        10
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

            <Footer />
        </div>
    );
}
