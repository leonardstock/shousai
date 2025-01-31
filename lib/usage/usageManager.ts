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
        const tierLimits = this.TIER_LIMITS[subscription.tier];
        const dailyLimit = tierLimits.dailyLimit;
        const monthlyLimit = tierLimits.monthlyLimit;

        const { dailyUsage, monthlyUsage } = await this.getOrganizationUsage(
            organizationId
        );

        if (dailyUsage >= dailyLimit) {
            return {
                isUsageLimited: true,
                reason: `Daily limit of ${dailyLimit} requests exceeded`,
            };
        }

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

    static async getOrganizationUsage(organizationId: string) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Get all user IDs in the organization
        const users = await prisma.user.findMany({
            where: { organizationId },
            select: { id: true },
        });

        const userIds = users.map((user) => user.id);

        if (userIds.length === 0) {
            return { dailyUsage: 0, monthlyUsage: 0 };
        }

        const [dailyUsage, monthlyUsage] = await Promise.all([
            prisma.usageLog.count({
                where: {
                    userId: { in: userIds },
                    createdAt: { gte: startOfDay },
                },
            }),
            prisma.usageLog.count({
                where: {
                    userId: { in: userIds },
                    createdAt: { gte: startOfMonth },
                },
            }),
        ]);

        return { dailyUsage, monthlyUsage };
    }
}
