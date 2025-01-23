import { clerkClient } from "@clerk/nextjs/server";

export const getOrganizationIdFromUserId = async (userId: string) => {
    const client = await clerkClient();
    const response = await client.users.getOrganizationMembershipList({
        userId: userId,
        limit: 1,
    });
    console.log(response.data[0].organization.id);
    const orgId = response.data[0].organization.id;
    return orgId;
};
