"use server";

import { prisma } from "@/lib/db/prisma";
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
                user: true,
            },
        });

        if (!apiKeyRecord) return null;

        return {
            userId: apiKeyRecord.userId,
            userDetails: apiKeyRecord.user,
        };
    } catch (error) {
        console.error("API Key Lookup Error:", error);
        return null;
    }
}

function hashApiKey(key: string) {
    return createHash("sha256").update(key).digest("hex");
}
