import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/shared/Card";
import { Alert, AlertDescription } from "@/components/shared/Alert";
import { DollarSign, Sparkles, BarChart } from "lucide-react";
import { UsageResponse } from "@/models/interfaces/usage";

const SavingsCalculator = ({ usageData }: { usageData: UsageResponse }) => {
    // Calculate potential savings
    const calculatePotentialSavings = () => {
        const repeatedQueries =
            usageData?.analytics.summary.total_requests || 0;
        const estimatedCostPerQuery = 0.08; // Average cost per query in GBP
        const potentialMonthlyCost = repeatedQueries * estimatedCostPerQuery;
        const potentialSavings = Math.max(0, potentialMonthlyCost - 200); // 200 GBP pro tier cost
        const cacheableQueries =
            usageData?.analytics.summary.cached_requests || 0;

        return {
            totalCost: potentialMonthlyCost,
            savings: potentialSavings,
            cacheableQueries,
        };
    };

    const { totalCost, savings, cacheableQueries } =
        calculatePotentialSavings();

    // Only show upgrade prompt if there are potential savings
    if (savings <= 0) return null;

    return (
        <div className='space-y-4'>
            <Card className='border-2 border-blue-200 bg-blue-50'>
                <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                        <Sparkles className='h-5 w-5 text-blue-500' />
                        Upgrade Opportunity Detected
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='flex flex-col gap-2'>
                            <div className='text-sm text-gray-500'>
                                Current Monthly Cost
                            </div>
                            <div className='text-2xl font-bold flex items-center gap-1'>
                                <DollarSign className='h-5 w-5 text-gray-500' />
                                {totalCost.toFixed(2)}
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='text-sm text-gray-500'>
                                Cacheable Queries
                            </div>
                            <div className='text-2xl font-bold flex items-center gap-1'>
                                <BarChart className='h-5 w-5 text-gray-500' />
                                {cacheableQueries}
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='text-sm text-gray-500'>
                                Potential Monthly Savings
                            </div>
                            <div className='text-2xl font-bold text-green-600 flex items-center gap-1'>
                                <DollarSign className='h-5 w-5' />
                                {savings.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <Alert className='bg-white'>
                        <AlertDescription>
                            <div className='font-medium'>
                                Upgrade to Pro Tier (£200/month) to unlock:
                            </div>
                            <ul className='mt-2 space-y-1 text-sm'>
                                <li>
                                    • Save £{savings.toFixed(2)} monthly with
                                    query caching
                                </li>
                                <li>
                                    • {cacheableQueries} of your queries could
                                    be cached
                                </li>
                                <li>• Instant responses for cached queries</li>
                                <li>
                                    • Increased daily (1,000) and monthly
                                    (10,000) limits
                                </li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
};

export default SavingsCalculator;
