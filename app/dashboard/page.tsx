"use client";

import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/shared/Card";
import { Alert, AlertDescription } from "@/components/shared/Alert";
import { Brain, Building2, Calendar, DollarSign } from "lucide-react";
import { subDays, subMonths, subYears, format } from "date-fns";
import { UsageResponse } from "@/models/interfaces/usage";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

type RangeType = "day" | "week" | "month" | "year";
type Provider = "all" | "openai" | "anthropic";

async function fetchUsageData(
    range: RangeType,
    provider: Provider,
    model: string
) {
    const now = new Date();
    let startDate;

    switch (range) {
        case "day":
            startDate = subDays(now, 1);
            break;
        case "week":
            startDate = subDays(now, 7);
            break;
        case "month":
            startDate = subMonths(now, 1);
            break;
        case "year":
            startDate = subYears(now, 1);
            break;
        default:
            startDate = subDays(now, 7);
    }

    const response = await fetch(
        `/api/v1/usage?start=${startDate.toISOString()}&end=${now.toISOString()}&provider=${provider}&model=${model}`
    );
    return response.json();
}

const CostDashboard = () => {
    const [timeRange, setTimeRange] = useState<RangeType>("week");
    const [usageData, setUsageData] = useState<UsageResponse>();
    const [provider, setProvider] = useState<Provider>("all");
    const [model, setModel] = useState<string>("all");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showTotalCostInGraph, setShowTotalCostInGraph] =
        useState<boolean>(true);
    const [showCacheSavingsInGraph, setShowCacheSavingsInGraph] =
        useState<boolean>(true);
    const [showActualCostInGraph, setShowActualCostInGraph] =
        useState<boolean>(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const data = await fetchUsageData(timeRange, provider, model);
            console.log(data);
            setUsageData(data);
            setIsLoading(false);
        }
        loadData();
    }, [timeRange, provider, model]);

    return (
        <div className='w-full max-w-screen-xl mx-auto p-4 space-y-6'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-5'>
                    <h2 className='text-2xl font-bold'>Usage Analytics</h2>
                    {isLoading && <LoadingIndicator ballSize={10} />}
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2'>
                        <Building2 className='h-4 w-4' />
                        <select
                            value={provider}
                            onChange={(e) =>
                                setProvider(e.target.value as Provider)
                            }
                            className='border rounded-md p-2'>
                            <option value='all'>All</option>
                            <option value='openai'>OpenAI</option>
                            <option value='anthropic'>Anthropic</option>
                        </select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Brain className='h-4 w-4' />
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value as string)}
                            className='border rounded-md p-2'>
                            <option value='all'>All</option>
                            <option value='gpt-3.5-turbo'>GPT 3.5</option>
                            <option value='gpt-4'>GPT 4</option>
                        </select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4' />
                        <select
                            value={timeRange}
                            onChange={(e) =>
                                setTimeRange(e.target.value as RangeType)
                            }
                            className='border rounded-md p-2'>
                            <option value='day'>Last 24h</option>
                            <option value='week'>Last Week</option>
                            <option value='month'>Last Month</option>
                            <option value='year'>Last Year</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between'>
                        <CardTitle>Total Cost</CardTitle>
                        <DollarSign className='h-4 w-4 text-green-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            $
                            {usageData?.analytics.summary.actual_cost.toFixed(
                                5
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cache Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {
                                usageData?.analytics.summary
                                    .average_cache_hit_rate
                            }
                            %
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            $
                            {usageData?.analytics.summary.total_savings.toFixed(
                                5
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[400px] w-full'>
                        <ResponsiveContainer>
                            <LineChart data={usageData?.analytics.daily}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis
                                    dataKey='date'
                                    tickFormatter={(date) =>
                                        format(
                                            new Date(date),
                                            timeRange === "day"
                                                ? "HH:mm"
                                                : "MMM dd"
                                        )
                                    }
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(date) =>
                                        format(
                                            new Date(date),
                                            timeRange === "day"
                                                ? "MMM dd, yyyy HH:mm"
                                                : "MMM dd, yyyy"
                                        )
                                    }
                                    formatter={(value) => [
                                        `$${(value as number).toFixed(5)}`,
                                        undefined,
                                    ]}
                                />
                                <Legend
                                    onClick={(event) => {
                                        switch (event.value) {
                                            case "Original Cost":
                                                setShowTotalCostInGraph(
                                                    !showTotalCostInGraph
                                                );
                                                break;
                                            case "Optimized Cost":
                                                setShowActualCostInGraph(
                                                    !showActualCostInGraph
                                                );
                                                break;
                                            case "Savings":
                                                setShowCacheSavingsInGraph(
                                                    !showCacheSavingsInGraph
                                                );
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                />
                                <Line
                                    type='monotone'
                                    dataKey='metrics.total_cost'
                                    name='Original Cost'
                                    hide={!showTotalCostInGraph}
                                    stroke='#ef4444'
                                    strokeWidth={2}
                                />
                                <Line
                                    type='monotone'
                                    dataKey='metrics.actual_cost'
                                    name='Optimized Cost'
                                    hide={!showActualCostInGraph}
                                    stroke='green'
                                    strokeWidth={2}
                                />
                                <Line
                                    type='monotone'
                                    dataKey='metrics.cached_cost'
                                    hide={!showCacheSavingsInGraph}
                                    name='Savings'
                                    stroke='purple'
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Alert>
                <AlertDescription>
                    <div className='font-medium mb-2'>Usage Breakdown:</div>
                    <div>
                        Total Requests:{" "}
                        {usageData?.analytics.summary.total_requests}
                    </div>
                    <div>
                        Cached Requests:{" "}
                        {usageData?.analytics.summary.cached_requests}
                    </div>
                    {usageData?.logs && (
                        <div>
                            Success Rate:{" "}
                            {(
                                (usageData?.logs.filter((log) => log.success)
                                    .length /
                                    usageData?.analytics.summary
                                        .total_requests) *
                                100
                            ).toFixed(1)}
                            %
                        </div>
                    )}
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default CostDashboard;
