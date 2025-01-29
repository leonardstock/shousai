import { prisma } from "../db/prisma";

export class UsageManager {
    static readonly TIER_LIMITS = {
        FREE: {
            dailyLimit: 50,
            monthlyLimit: 500,
        },
        PRO: {
            dailyLimit: 1000,
            monthlyLimit: 10000,
        },
        ENTERPRISE: {
            dailyLimit: 5000,
            monthlyLimit: 50000,
        },
    };

    static async checkUsageLimit(
        userId: string
    ): Promise<{ isUsageLimited: boolean; reason: string }> {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
            select: {
                tier: true,
                monthlyUsageLimit: true,
                dailyUsageLimit: true,
            },
        });

        if (!subscription) {
            throw new Error("No subscription found");
        }

        const tierLimits = this.TIER_LIMITS[subscription.tier];
        const dailyLimit =
            subscription.dailyUsageLimit || tierLimits.dailyLimit;
        const monthlyLimit =
            subscription.monthlyUsageLimit || tierLimits.monthlyLimit;

        // Check daily usage
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const dailyUsage = await prisma.usageLog.count({
            where: {
                userId,
                createdAt: { gte: startOfDay },
            },
        });

        if (dailyUsage >= dailyLimit) {
            return {
                isUsageLimited: true,
                reason: `Daily limit of ${dailyLimit} requests exceeded`,
            };
        }

        // Check monthly usage
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyUsage = await prisma.usageLog.count({
            where: {
                userId,
                createdAt: { gte: startOfMonth },
            },
        });

        if (monthlyUsage >= monthlyLimit) {
            return {
                isUsageLimited: true,
                reason: `Monthly limit of ${monthlyLimit} requests exceeded`,
            };
        }

        return { isUsageLimited: false, reason: "" };
    }

    static async getUserUsage(userId: string) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [dailyUsage, monthlyUsage] = await Promise.all([
            prisma.usageLog.count({
                where: {
                    userId,
                    createdAt: { gte: startOfDay },
                },
            }),
            prisma.usageLog.count({
                where: {
                    userId,
                    createdAt: { gte: startOfMonth },
                },
            }),
        ]);

        return {
            dailyUsage,
            monthlyUsage,
        };
    }
}
