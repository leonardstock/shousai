"use server";

import { prisma } from "@/lib/db/prisma";

export async function getSubscriptionTier(userId: string) {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: { userId: userId, status: "active" },
            select: {
                tier: true,
            },
        });

        return subscription?.tier ?? "FREE";
    } catch (error) {
        console.error(error);
        return "FREE";
    }
}

export async function upgradeUserSubscription(
    organizationId: string,
    stripeCustomerId?: string,
    stripeSubscriptionId?: string
) {
    try {
        const users = await prisma.user.findMany({
            where: { organizationId },
            select: { id: true },
        });

        const updates = await Promise.all(
            users.map((user) => {
                return prisma.subscription.upsert({
                    where: { userId: user.id },
                    create: {
                        userId: user.id,
                        tier: "PRO",
                        stripeCustomerId: stripeCustomerId,
                        stripeSubscriptionId: stripeSubscriptionId,
                        status: "active",
                        startDate: new Date(),
                    },
                    update: {
                        tier: "PRO",
                        stripeCustomerId: stripeCustomerId,
                        stripeSubscriptionId: stripeSubscriptionId,
                        status: "active",
                    },
                });
            })
        );

        return updates;
    } catch (error) {
        console.error("Error upgrading subscription:", error);
        throw error;
    }
}

export async function downgradeUserSubscription(organizationId: string) {
    try {
        const users = await prisma.user.findMany({
            where: { organizationId },
            select: { id: true },
        });

        const updates = await Promise.all(
            users.map((user) =>
                prisma.subscription.upsert({
                    where: { userId: user.id },
                    create: {
                        userId: user.id,
                        tier: "FREE",
                        status: "active",
                        startDate: new Date(),
                    },
                    update: {
                        tier: "FREE",
                        status: "active",
                    },
                })
            )
        );

        return updates;
    } catch (error) {
        console.error("Error downgrading subscription:", error);
        throw error;
    }
}
