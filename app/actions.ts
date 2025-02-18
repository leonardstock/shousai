"use server";

import { getSubscriptionTier } from "@/actions/subscriptions";
import {
    ApiCallLimitReachedEmail,
    CustomSpendLimitReachedEmail,
    SuggestionEmail,
} from "@/components/email/Templates";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/emails/emailUtils";
import { UsageManager } from "@/lib/usage/usageManager";
import { clerkClient } from "@clerk/nextjs/server";
import { Subscription } from "@prisma/client";
import { createHash } from "crypto";

interface UsageLogFilters {
    dateFrom?: Date;
    dateTo?: Date;
    model?: string;
    provider?: string;
}

export async function sendSuggestionEmail(
    message: string,
    senderEmail: string
) {
    try {
        await sendEmail({
            to: ["leo.stock@live.de"],
            subject: "Feature Suggestion",
            body: SuggestionEmail({ message, senderEmail }),
        });
    } catch (error) {
        console.error("Error sending suggestion email:", error);
    }
}

export async function getUserRole(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                role: true,
            },
        });

        return user?.role;
    } catch (error) {
        console.error(error);
        return null;
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

export async function getOrganizationUsageAndLimit(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                organizationId: true,
            },
        });

        const subscriptionTier = await getSubscriptionTier(userId);

        if (!user || !user.organizationId) {
            throw new Error("User, organization or subscription not found");
        }

        const { organizationId } = user;

        const { dailyUsage, monthlyUsage } =
            await UsageManager.getOrganizationUsage(organizationId);

        const tierLimits = UsageManager.TIER_LIMITS[subscriptionTier];
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

export async function getOrganizationUsageLogsFromUserId(
    userId: string,
    filters: UsageLogFilters = {}
) {
    try {
        const { members } = await getOrganizationAndMembersFromUserId(userId);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereClause: any = {
            userId: { in: members.map((member) => member.id) },
        };

        // Filter by date range if provided
        if (filters.dateFrom || filters.dateTo) {
            whereClause.createdAt = {};
            if (filters.dateFrom) {
                whereClause.createdAt.gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                whereClause.createdAt.lte = filters.dateTo;
            }
        }

        // Filter by model if provided (only include if not null/undefined)
        if (filters.model != "all") {
            whereClause.model = filters.model;
        }

        // Filter by provider if provided (only include if not null/undefined)
        if (filters.provider != "all") {
            whereClause.provider = filters.provider;
        }

        const result = await prisma.usageLog.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "asc",
            },
        });

        return result;
    } catch (error) {
        console.error("Error fetching organization usage logs:", error);
        return [];
    }
}

export async function getOrganizationAndMembersFromUserId(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                organization: true,
            },
        });

        if (!user || !user.organization) {
            throw new Error("User or organization not found");
        }

        const members = await prisma.user.findMany({
            where: {
                organizationId: user.organizationId,
            },
        });

        const { organization } = user;

        return {
            organization,
            members,
        };
    } catch (error) {
        console.error("Error fetching organization and members:", error);
        return {
            organization: null,
            members: [],
        };
    }
}

export const removeMemberFromOrganization = async (
    userId: string,
    orgId: string
) => {
    try {
        const client = await clerkClient();
        await client.organizations.deleteOrganizationMembership({
            organizationId: orgId,
            userId: userId,
        });
    } catch (error) {
        console.error("Error removing member from organization:", error);
    }
};

export const updateOrganizationName = async (orgId: string, name: string) => {
    try {
        const client = await clerkClient();
        await client.organizations.updateOrganization(orgId, {
            name: name,
        });
    } catch (error) {
        console.error("Error updating organization name:", error);
    }
};

export const updateOrganizationSpendLimit = async (
    orgId: string,
    spendLimit: number
) => {
    try {
        await prisma.organization.update({
            where: { id: orgId },
            data: {
                spendLimit: spendLimit,
            },
        });
    } catch (error) {
        console.error("Error updating organization spend limit:", error);
    }
};

export const deleteOrganization = async (orgId: string) => {
    try {
        const client = await clerkClient();
        await client.organizations.deleteOrganization(orgId);
    } catch (error) {
        console.error("Error deleting organization:", error);
    }
};

export const handleCheckCustomSpendLimit = async (userId: string) => {
    try {
        const { organization, members } =
            await getOrganizationAndMembersFromUserId(userId);

        if (organization) {
            const customSpendLimit = organization.spendLimit || Infinity;
            const allSpend = await getAllOrganizationSpend(organization.id);

            if (
                customSpendLimit !== Infinity &&
                allSpend >= customSpendLimit &&
                organization.spendLimitEmailSent === false
            ) {
                sendEmail({
                    to: members.map((member) => member.email),
                    subject: "Custom Spend Limit Reached",
                    body: CustomSpendLimitReachedEmail({
                        organization,
                        customSpendLimit,
                    }),
                });

                await prisma.organization.update({
                    where: { id: organization?.id },
                    data: {
                        spendLimitEmailSent: true,
                    },
                });
            }
        }
        return true;
    } catch (error) {
        console.error("Error checking custom spend limit:", error);
        return false;
    }
};

export const getAllOrganizationSpend = async (orgId: string) => {
    try {
        const { members } = await getOrganizationAndMembersFromUserId(orgId);

        const result = await prisma.usageLog.aggregate({
            _sum: {
                cost: true,
            },
            where: {
                userId: { in: members.map((member) => member.id) },
            },
        });

        return result._sum.cost ?? 0;
    } catch (error) {
        console.error("Error getting all organization spend:", error);
        return -1;
    }
};

export const handleApiUsageLimitReachedEmail = async ({
    userId,
    tier,
    daily,
}: {
    userId: string;
    tier: Subscription["tier"];
    daily: boolean;
}) => {
    try {
        const { organization, members } =
            await getOrganizationAndMembersFromUserId(userId);

        if (!organization) {
            return;
        }

        const tierLimits = UsageManager.TIER_LIMITS[tier];
        const dailyLimit = tierLimits.dailyLimit;
        const monthlyLimit = tierLimits.monthlyLimit;

        await sendEmail({
            to: members.map((member) => member.email),
            subject: daily
                ? "Daily API Call Limit Reached"
                : "Monthly API Call Limit Reached",
            body: ApiCallLimitReachedEmail({
                organization,
                apiCallLimit: daily ? dailyLimit : monthlyLimit,
                daily,
            }),
        });

        if (daily) {
            await prisma.organization.update({
                where: { id: organization?.id },
                data: {
                    dailyApiCallLimitEmailSent: true,
                },
            });
        } else {
            await prisma.organization.update({
                where: { id: organization?.id },
                data: {
                    monthlyApiCallLimitEmailSent: true,
                },
            });
        }
    } catch (error) {
        console.error("Error sending API call limit reached email:", error);
    }
};

function hashApiKey(key: string) {
    return createHash("sha256").update(key).digest("hex");
}
