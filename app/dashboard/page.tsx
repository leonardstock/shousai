import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/dashboard/components/card";
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";
import { AlertCircle, TrendingUp, DollarSign, Box } from "lucide-react";

const Dashboard = () => {
    // Sample data - would come from actual API tracking
    const costData = [
        { date: "2024-01", openai: 520, anthropic: 320, cohere: 150 },
        { date: "2024-02", openai: 680, anthropic: 450, cohere: 220 },
        { date: "2024-03", openai: 750, anthropic: 580, cohere: 280 },
    ];

    const alerts = [
        { id: 1, type: "warning", message: "GPT-4 usage spike in Project A" },
        { id: 2, type: "alert", message: "Monthly budget 85% utilized" },
    ];

    const totalSpend = costData.reduce(
        (acc, curr) => acc + curr.openai + curr.anthropic + curr.cohere,
        0
    );

    return (
        <div className='w-full p-6 space-y-6'>
            {/* Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Spend
                        </CardTitle>
                        <DollarSign className='w-4 h-4 text-gray-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            ${totalSpend.toLocaleString()}
                        </div>
                        <p className='text-xs text-gray-500'>
                            Current billing period
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Active Projects
                        </CardTitle>
                        <Box className='w-4 h-4 text-gray-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>12</div>
                        <p className='text-xs text-gray-500'>
                            Using AI services
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Cost Trend
                        </CardTitle>
                        <TrendingUp className='w-4 h-4 text-gray-500' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>+24%</div>
                        <p className='text-xs text-gray-500'>vs last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Cost Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Cost Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='h-[300px]'>
                        {/* <ResponsiveContainer width='100%' height='100%'>
                            <LineChart data={costData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='date' />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type='monotone'
                                    dataKey='openai'
                                    stroke='#0ea5e9'
                                    name='OpenAI'
                                />
                                <Line
                                    type='monotone'
                                    dataKey='anthropic'
                                    stroke='#8b5cf6'
                                    name='Anthropic'
                                />
                                <Line
                                    type='monotone'
                                    dataKey='cohere'
                                    stroke='#10b981'
                                    name='Cohere'
                                />
                            </LineChart>
                        </ResponsiveContainer> */}
                    </div>
                </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className='flex items-center space-x-2 text-sm'>
                                <AlertCircle className='w-4 h-4 text-amber-500' />
                                <span>{alert.message}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
