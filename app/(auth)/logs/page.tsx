"use client";

import { getOrganizationUsageLogsFromUserId } from "@/app/actions";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { DateRange } from "@/models/types/dateRange";
import { Provider } from "@/models/types/provider";
import {
    HUMAN_READABLE_NAMES,
    HUMAN_READABLE_PROVIDER_NAMES,
} from "@/models/types/supportedModels";
import { useUser } from "@clerk/nextjs";
import { UsageLog } from "@prisma/client";
import { Brain, Building2, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

const LogsPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
    // const [searchTerm, setSearchTerm] = useState<string>("");
    const [timeRange, setTimeRange] = useState<DateRange>("week");
    const [provider, setProvider] = useState<Provider>("all");
    const [model, setModel] = useState<string>("all");
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            const handleDataLoad = async (userId: string) => {
                try {
                    setIsLoading(true);
                    const logs = await getOrganizationUsageLogsFromUserId(
                        userId,
                        { model, provider }
                    );
                    setUsageLogs(logs);
                } catch (error) {
                    console.error("Error fetching usage logs:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            handleDataLoad(user.id);
        }
    }, [user, model, provider]);

    return (
        <div className='w-full p-4 space-y-6'>
            <div className='flex flex-col md:flex-row justify-between md:items-center'>
                <div className='flex items-center gap-5 lg:mb-0 mb-4'>
                    <h2 className='text-2xl font-bold'>Usage Logs</h2>
                    {isLoading && <LoadingIndicator ballSize={10} />}
                </div>
                <div className='flex md:flex-row flex-col md:items-center gap-2'>
                    {/* <div className='flex items-center gap-2'>
                        <input
                            type='text'
                            placeholder='Search by date, model, provider'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='border rounded-md p-2 focus:outline-none'
                            style={{ height: 40 }}></input>
                    </div> */}
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
                            {Object.keys(HUMAN_READABLE_NAMES).map((model) => (
                                <option value={model} key={model}>
                                    {HUMAN_READABLE_NAMES[model]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4' />
                        <select
                            value={timeRange}
                            onChange={(e) =>
                                setTimeRange(e.target.value as DateRange)
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
            <div className='overflow-x-auto rounded-lg'>
                <table className='min-w-full divide-border-300 divide-y pt-6'>
                    <thead className='bg-gray-50 text-gray-700'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>
                                Date
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Model
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Provider
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Input Tokens
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Output Tokens
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Cost
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Success
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Cached
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 bg-white'>
                        {usageLogs.length === 0 && (
                            <tr>
                                <td
                                    className='whitespace-nowrap px-6 py-4 text-lg text-gray-500 text-center pt-6'
                                    colSpan={8}>
                                    No usage logs found
                                </td>
                            </tr>
                        )}
                        {usageLogs.map((log) => (
                            <tr key={log.id}>
                                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                                    {log.createdAt.toLocaleString()}
                                </td>
                                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                                    {HUMAN_READABLE_NAMES[log.model]}
                                </td>
                                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                                    {
                                        HUMAN_READABLE_PROVIDER_NAMES[
                                            log.provider
                                        ]
                                    }
                                </td>
                                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                                    {log.inputTokens}
                                </td>
                                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                                    {log.outputTokens}
                                </td>
                                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                                    {log.cost}
                                </td>
                                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                                    {log.success ? "Successful" : "Failed"}
                                </td>
                                <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                                    {log.cached ? "Cached" : "Not Cached"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogsPage;
