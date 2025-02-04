import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shared/Card";
import { User } from "@prisma/client";
import {
    getOrganizationAndMembersFromUserId,
    getSubscriptionTier,
    removeMemberFromOrganization,
} from "@/app/actions";
import { Button } from "@/components/shared/Button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export function OrganizationMembersList() {
    const { user } = useUser();
    const [members, setMembers] = useState<User[]>([]);
    const [userRole, setUserRole] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [organizationId, setOrganizationId] = useState<string>("");
    const [subscriptionTier, setSubscriptionTier] = useState("FREE");

    useEffect(() => {
        if (user) {
            const fetchMembers = async () => {
                try {
                    const { members } =
                        await getOrganizationAndMembersFromUserId(user?.id);
                    setMembers(members);
                    const tier = await getSubscriptionTier(user.id);
                    setSubscriptionTier(tier!);
                } catch (error) {
                    console.error("Failed to fetch members:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            if (
                user?.organizationMemberships &&
                user?.organizationMemberships.length > 0
            ) {
                setUserRole(user?.organizationMemberships[0]?.role);
                setOrganizationId(user?.organizationMemberships[0]?.id);
            }

            fetchMembers();
        }
    }, [user]);

    const handleRemoveMember = async (memberId: string) => {
        try {
            await removeMemberFromOrganization(memberId, organizationId);
            // Update the local state to remove the member
            setMembers(members.filter((member) => member.id !== memberId));
        } catch (error) {
            console.error("Failed to remove member:", error);
        }
    };

    return (
        <>
            <div className='text-xl rounded-lg space-y-3'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-medium'>Members ({members.length})</h3>
                </div>
            </div>
            {isLoading && <LoadingIndicator />}
            {subscriptionTier === "FREE" && !isLoading && (
                <div className='text-muted-foreground text-center'>
                    Head over to Manage Subscription to upgrade to Pro tier and
                    invite others to your team!
                </div>
            )}

            {subscriptionTier !== "FREE" &&
                members.length === 1 &&
                !isLoading && (
                    <div className='text-muted-foreground text-center'>
                        No other users found. Invite your colleagues!
                    </div>
                )}

            {!isLoading &&
                members.length > 1 &&
                members.map((member) => (
                    <Card key={member.id}>
                        <CardHeader>
                            <CardTitle>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        {member.id === user?.id
                                            ? "You"
                                            : `${member.firstName} ${member.lastName}`}
                                    </div>
                                    {userRole === "org:admin" && (
                                        <div className='flex items-center gap-2'>
                                            <Button
                                                onClick={() =>
                                                    handleRemoveMember(
                                                        member.id
                                                    )
                                                }>
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>{member.email}</div>
                        </CardContent>
                    </Card>
                ))}
        </>
    );
}
