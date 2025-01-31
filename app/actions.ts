"use server";

import { prisma } from "@/lib/db/prisma";
import { UsageManager } from "@/lib/usage/usageManager";
import { createHash } from "crypto";

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

export async function getOrganizationUsageAndLimit(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                organizationId: true,
                subscription: { select: { tier: true } },
            },
        });

        if (!user || !user.organizationId || !user.subscription) {
            throw new Error("User, organization or subscription not found");
        }

        const { organizationId, subscription } = user;

        const { dailyUsage, monthlyUsage } =
            await UsageManager.getOrganizationUsage(organizationId);

        const tierLimits = UsageManager.TIER_LIMITS[subscription.tier];
        const dailyLimit = tierLimits.dailyLimit;
        const monthlyLimit = tierLimits.monthlyLimit;

        return {
            dailyUsage: dailyUsage,
            monthlyUsage: monthlyUsage,
            dailyUsageLimit: dailyLimit,
            monthlyUsageLimit: monthlyLimit,
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
