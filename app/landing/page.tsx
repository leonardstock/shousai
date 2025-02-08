/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { ArrowRight, BarChart, Lock, Zap } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function LandingPage() {
    const handleSubmit = async () => {
        redirect("/signup");
    };

    const axiosExample = `const response = await axios.post('https://shousai.co.uk/api/v1/proxy', {
    apiKey: 'your-shousai-api-key",',
    providerKey: 'your-provider-api-key',
    model: 'gpt-4',
    messages: [
        {
            role: 'user',
            content: 'Hello, world'
        }
    ]
});`;

    const anthropicBefore = `const responseAnthropic = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [
    {"role": "user", "content": "Hello, world"}
  ]
});`;

    const openAiBefore = `const completion = await openai.chat.completions.create({
    messages: [{ role: "developer", content: "You are a helpful assistant." }],
    model: "gpt-4o",
    store: true,
  });`;

    return (
        <div className='min-h-screen bg-white'>
            {/* Hero Section */}
            <div className='relative overflow-hidden'>
                <div className='max-w-7xl mx-auto'>
                    <div className='relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32'>
                        <main className='mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28'>
                            <div className='text-center'>
                                <h1 className='text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl'>
                                    <span className='block'>
                                        Stop Wasting Money on
                                    </span>
                                    <span className='block text-indigo-600'>
                                        AI API Calls
                                    </span>
                                </h1>
                                <p className='mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl'>
                                    Save{" "}
                                    <span className="after:content-['*']">
                                        up to 40%
                                    </span>{" "}
                                    on your OpenAI costs with intelligent
                                    caching and optimization. Built by
                                    developers, for developers.
                                </p>
                                <div className='mt-5 sm:mt-8 sm:flex sm:justify-center'>
                                    <div className='rounded-md shadow'>
                                        <button
                                            className='w-full flex items-center justify-center px-8 py-3 background-gradient text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10'
                                            onClick={handleSubmit}>
                                            Start Saving Now
                                            <ArrowRight className='ml-2 h-5 w-5' />
                                        </button>
                                    </div>
                                </div>
                                <div className='text-xs mt-4 text-gray-600'>
                                    * varies based on usage pattern
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {/* Social Proof */}
            <div className='bg-gray-50 py-12'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <p className='text-center text-sm font-semibold uppercase text-gray-600 tracking-wide'>
                        Built for users of
                    </p>
                    <div className='mt-6 grid grid-cols-2 gap-8 md:grid-cols-3'>
                        {/* Replace with actual company logos */}
                        <div className='col-span-1 flex justify-center items-center grayscale opacity-40'>
                            <Image
                                className='align-center mx-auto filter grayscale opacity-60 w-auto h-4 md:h-6'
                                alt='Anthropic Logo'
                                src={"/anthropic-seeklogo.svg"}
                                width={1024}
                                height={115}
                            />
                        </div>
                        <div className='col-span-1 flex justify-center items-center grayscale opacity-40'>
                            <Image
                                className='align-center mx-auto filter grayscale opacity-60 w-auto h-4 md:h-6'
                                alt='OpenAI Logo'
                                src={"/OpenAI_logo_2025.svg"}
                                width={512}
                                height={139}
                            />
                        </div>
                        <div className='col-span-1 flex justify-center items-center grayscale opacity-40'>
                            <div className='h-8 text-gray-600'>
                                Your AI startup
                            </div>
                        </div>
                        {/* Repeat for other logos */}
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className='py-16 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                            <div className='flex items-center'>
                                <Zap className='h-6 w-6 text-indigo-600' />
                                <h3 className='ml-2 text-lg font-medium text-gray-900'>
                                    Smart Caching
                                </h3>
                            </div>
                            <p className='mt-2 text-gray-500'>
                                Stop paying for repeat API calls. Our
                                intelligent caching saves you money
                                automatically.
                            </p>
                        </div>

                        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                            <div className='flex items-center'>
                                <BarChart className='h-6 w-6 text-indigo-600' />
                                <h3 className='ml-2 text-lg font-medium text-gray-900'>
                                    Cost Analytics
                                </h3>
                            </div>
                            <p className='mt-2 text-gray-500'>
                                Real-time dashboard shows exactly where your
                                money is going and how much you&apos;re saving.
                            </p>
                        </div>

                        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                            <div className='flex items-center'>
                                <Lock className='h-6 w-6 text-indigo-600' />
                                <h3 className='ml-2 text-lg font-medium text-gray-900'>
                                    Easy Integration
                                </h3>
                            </div>
                            <p className='mt-2 text-gray-500'>
                                Get started in minutes with our simple SDK. No
                                complex setup required.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Example */}
            <div className='bg-gray-50 py-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='lg:flex lg:justify-between lg:items-center'>
                        <div>
                            <h2 className='text-3xl font-extrabold text-gray-900'>
                                Integration as Simple as One Line
                            </h2>
                            <p className='mt-3 text-lg text-gray-500'>
                                Replace your existing AI API calls with our
                                optimized client.
                                <br /> That&apos;s it.
                            </p>
                        </div>
                        <div className='mt-8 lg:mt-0'>
                            <div className='bg-black rounded-lg p-6 text-gray-100 font-mono text-sm'>
                                <p className='text-gray-400'>// Before</p>
                                <pre className='text-gray-300 overflow-x-auto'>
                                    <code>{anthropicBefore}</code>
                                </pre>
                                <pre className='text-gray-300 overflow-x-auto'>
                                    <code>{openAiBefore}</code>
                                </pre>
                                <p className='mt-6 text-gray-400'>// After</p>
                                <pre className='text-gray-300 overflow-x-auto'>
                                    <code>{axiosExample}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className='bg-indigo-600'>
                <div className='max-w-2xl mx-auto py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8'>
                    <h2 className='text-3xl font-extrabold text-white sm:text-4xl'>
                        <span className='block'>
                            Ready to reduce your AI costs?
                        </span>
                    </h2>
                    <p className='mt-4 text-lg leading-6 text-indigo-100'>
                        Start saving money on AI API calls today. No credit card
                        required.
                    </p>
                    <button
                        className='mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto'
                        onClick={handleSubmit}>
                        Get Started Free
                        <ArrowRight className='ml-2 h-5 w-5' />
                    </button>
                </div>
            </div>
        </div>
    );
}
