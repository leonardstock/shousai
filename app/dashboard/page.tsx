"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/shared/Card";
import { Alert, AlertDescription } from "@/components/shared/Alert";
import { DollarSign, TrendingDown, Zap } from "lucide-react";
import { PromptOptimizer } from "@/lib/optimization/prompt";

// Sample data - replace with real metrics from your optimization tests
const data = [
    { date: "2024-01-01", originalCost: 100, optimizedCost: 100 },
    { date: "2024-01-02", originalCost: 120, optimizedCost: 95 },
    { date: "2024-01-03", originalCost: 115, optimizedCost: 88 },
    { date: "2024-01-04", originalCost: 130, optimizedCost: 92 },
    { date: "2024-01-05", originalCost: 125, optimizedCost: 85 },
];

const CostDashboard = () => {
    // Calculate savings metrics
    const totalOriginalCost = data.reduce(
        (sum, day) => sum + day.originalCost,
        0
    );
    const totalOptimizedCost = data.reduce(
        (sum, day) => sum + day.optimizedCost,
        0
    );
    const totalSaved = totalOriginalCost - totalOptimizedCost;
    const savingsPercentage = ((totalSaved / totalOriginalCost) * 100).toFixed(
        1
    );

    async function optimizationDemo() {
        const samplePrompts = [
            "Please can you tell me in detail about how to make a sandwich if possible thanks",
            "I would like you to explain in order to help me understand the process of photosynthesis due to the fact that I am studying biology",
            "At this point in time I need you to analyze this data",
        ];

        // Single prompt optimization
        const result = PromptOptimizer.optimize(samplePrompts[2]);
        console.log("Original prompt:", samplePrompts[2]);
        console.log("Optimized prompt:", result.optimizedPrompt);
        console.log("Tokens saved:", result.savings);
        console.log("Optimizations applied:", result.optimizations);

        // Analyze prompt history
        const analysis = await PromptOptimizer.analyzePromptHistory(
            samplePrompts
        );
        console.log("Total tokens saved:", analysis.totalSaved);
        console.log("Average savings per prompt:", analysis.averageSavings);
        console.log("Optimization success rate:", analysis.optimizationRate);
        console.log("Recommendations:", analysis.recommendations);
    }

    return (
        <div className='w-full max-w-6xl mx-auto p-4 space-y-6'>
            {/* Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Cost Savings
                        </CardTitle>
                        <DollarSign className='h-4 w-4 text-green-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            ${totalSaved.toFixed(2)}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Over last 5 days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Savings Percentage
                        </CardTitle>
                        <TrendingDown className='h-4 w-4 text-blue-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {savingsPercentage}%
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            Average reduction
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Optimizations Applied
                        </CardTitle>
                        <Zap className='h-4 w-4 text-yellow-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>3</div>
                        <p className='text-xs text-muted-foreground'>
                            Active optimizations
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Cost Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Cost Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[300px] w-full'>
                        <LineChart
                            width={800}
                            height={300}
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='date' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type='monotone'
                                dataKey='originalCost'
                                stroke='#ff0000'
                                name='Original Cost'
                            />
                            <Line
                                type='monotone'
                                dataKey='optimizedCost'
                                stroke='#00ff00'
                                name='Optimized Cost'
                            />
                        </LineChart>
                    </div>
                </CardContent>
            </Card>

            {/* Optimization Alerts */}
            <Alert>
                <AlertDescription>
                    <div className='flex flex-col space-y-2'>
                        <div className='font-medium'>Active Optimizations:</div>
                        <ul className='list-disc pl-4'>
                            <li>
                                Prompt length optimization reducing token usage
                                by 15%
                            </li>
                            <li>
                                Automatic model downgrading for simple tasks
                                saving 25%
                            </li>
                            <li>
                                Response caching preventing duplicate API calls
                            </li>
                        </ul>
                    </div>
                </AlertDescription>
            </Alert>

            <button onClick={optimizationDemo}>Run Optimization Demo</button>
        </div>
    );
};

export default CostDashboard;
