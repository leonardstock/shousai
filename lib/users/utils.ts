import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { SubscriptionTier } from "@prisma/client";
import { UsageManager } from "../usage/usageManager";

export const getOrganizationIdFromUserId = async (userId: string) => {
    const client = await clerkClient();
    const response = await client.users.getOrganizationMembershipList({
        userId: userId,
        limit: 1,
    });
    const orgId = response.data[0].organization.id;
    return orgId;
};

export async function createUserWithFreeTier(userData: {
    email: string;
    organizationId?: string;
}) {
    try {
        // Create user with automatic free tier subscription
        const user = await prisma.user.create({
            data: {
                email: userData.email,
                organizationId: userData.organizationId,
                subscription: {
                    create: {
                        tier: "FREE",
                        status: "active",
                        monthlyUsageLimit:
                            UsageManager.TIER_LIMITS.FREE.monthlyLimit,
                        dailyUsageLimit:
                            UsageManager.TIER_LIMITS.FREE.dailyLimit,
                    },
                },
            },
            include: {
                subscription: true,
            },
        });

        return user;
    } catch (error) {
        console.error("Error creating user with free tier:", error);
        throw error;
    }
}

// Utility to check and upgrade subscription
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
            },
        });
    } catch (error) {
        console.error("Error upgrading subscription:", error);
        throw error;
    }
}

// Helper to check current subscription tier
export async function getUserSubscriptionTier(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                subscription: {
                    select: {
                        tier: true,
                        status: true,
                    },
                },
            },
        });

        return user?.subscription?.tier;
    } catch (error) {
        console.error(error);
        return "FREE";
    }
}

export async function canAccessFeature(
    userId: string,
    requiredTier: SubscriptionTier = "PRO"
): Promise<boolean> {
    try {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
            select: { tier: true },
        });

        // If no subscription found, default to no access
        if (!subscription) return false;

        // Pro tier can access everything
        if (subscription.tier === "PRO") return true;

        // Check if feature requires pro tier
        return subscription.tier === requiredTier;
    } catch (error) {
        console.error("Error checking feature access:", error);
        return false;
    }
}

export async function cancelSubscription(userId: string) {
    try {
        return await prisma.subscription.update({
            where: { userId },
            data: {
                tier: "FREE",
                status: "canceled",
                endDate: new Date(),
            },
        });
    } catch (error) {
        console.error("Error canceling subscription:", error);
        throw error;
    }
}
