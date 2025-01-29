"use server";

import { prisma } from "@/lib/db/prisma";
import { UsageManager } from "@/lib/usage/usageManager";
import { createHash } from "crypto";

export async function handleEarlyAccessSubmit(email: string) {
    try {
        await prisma.earlyAccess.create({
            data: {
                email: email,
            },
        });

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getSubscriptionTier(userId: string) {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: { userId: userId },
            select: {
                tier: true,
            },
        });

        return subscription?.tier;
    } catch (error) {
        console.error(error);
        return "FREE";
    }
}

export async function upgradeUserSubscription(
    userId: string,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string
) {
    try {
        return await prisma.subscription.update({
            where: { userId },
            data: {
                tier: "PRO",
                stripeCustomerId,
                stripeSubscriptionId,
                status: "active",
                startDate: new Date(),
                monthlyUsageLimit: UsageManager.TIER_LIMITS.PRO.monthlyLimit,
                dailyUsageLimit: UsageManager.TIER_LIMITS.PRO.dailyLimit,
            },
        });
    } catch (error) {
        console.error("Error upgrading subscription:", error);
        throw error;
    }
}

export async function downgradeUserSubscription(
    userId: string,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string
) {
    try {
        return await prisma.subscription.update({
            where: { userId },
            data: {
                tier: "FREE",
                stripeCustomerId,
                stripeSubscriptionId,
                status: "active",
                startDate: new Date(),
                monthlyUsageLimit: UsageManager.TIER_LIMITS.FREE.monthlyLimit,
                dailyUsageLimit: UsageManager.TIER_LIMITS.FREE.dailyLimit,
            },
        });
    } catch (error) {
        console.error("Error downgrading subscription:", error);
        throw error;
    }
}

export async function getUserFromApiKey(apiKey: string) {
    try {
        const hashedKey = hashApiKey(apiKey);

        const apiKeyRecord = await prisma.apiKey.findUnique({
            where: {
                key: hashedKey,
                enabled: true,
            },
            include: {
                user: {
                    include: {
                        subscription: true,
                    },
                },
            },
        });

        if (!apiKeyRecord) return null;

        return {
            userId: apiKeyRecord.userId,
            userDetails: apiKeyRecord.user,
            subscription: apiKeyRecord.user.subscription,
        };
    } catch (error) {
        console.error("API Key Lookup Error:", error);
        return null;
    }
}

export async function getUserUsageAndLimit(userId: string) {
    try {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
            select: {
                dailyUsageLimit: true,
                monthlyUsageLimit: true,
            },
        });

        const { dailyUsage, monthlyUsage } = await UsageManager.getUserUsage(
            userId
        );

        return {
            dailyUsage: dailyUsage || 0,
            monthlyUsage: monthlyUsage || 0,
            dailyUsageLimit: subscription?.dailyUsageLimit || 0,
            monthlyUsageLimit: subscription?.monthlyUsageLimit || 0,
        };
    } catch (error) {
        console.error("Error fetching user usage and limit:", error);
        return {
            dailyUsageLimit: 0,
            monthlyUsageLimit: 0,
            dailyUsage: 0,
            monthlyUsage: 0,
        };
    }
}

function hashApiKey(key: string) {
    return createHash("sha256").update(key).digest("hex");
}
