"use client";

import { getOrganizationUsageAndLimit } from "@/app/actions";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface UsageIndicatorProps {
    type: "daily" | "monthly";
}

const UsageIndicator = ({ type }: UsageIndicatorProps) => {
    const [currentUsage, setCurrentUsage] = useState(0);
    const [limit, setLimit] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();

    const usagePercentage = Math.min((currentUsage / limit) * 100, 100);

    useEffect(() => {
        const handleDataLoad = async (userId: string) => {
            setIsLoading(true);
            const {
                dailyUsageLimit,
                monthlyUsageLimit,
                dailyUsage,
                monthlyUsage,
            } = await getOrganizationUsageAndLimit(userId);

            if (type === "daily") {
                setLimit(dailyUsageLimit);
                setCurrentUsage(dailyUsage);
            } else {
                setLimit(monthlyUsageLimit);
                setCurrentUsage(monthlyUsage);
            }
            setIsLoading(false);
        };

        if (user) {
            handleDataLoad(user.id);
        }
    }, [user, type]);

    const color =
        usagePercentage < 50
            ? "green"
            : usagePercentage < 80
              ? "yellow"
              : "#ef4444";

    return (
        <div className='w-full h-6 bg-gray-200 rounded-lg relative'>
            {!isLoading && (
                <div
                    className='h-full rounded-lg transition-all'
                    style={{
                        width: `${usagePercentage}%`,
                        backgroundColor: color,
                    }}
                />
            )}
            <div className='absolute inset-0 flex justify-center items-center text-sm text-black'>
                {currentUsage} / {limit} Requests
            </div>
        </div>
    );
};

export default UsageIndicator;
