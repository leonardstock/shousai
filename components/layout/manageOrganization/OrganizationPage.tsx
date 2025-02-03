import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { Button } from "../../shared/Button";
import { Check, Pen, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../../shared/Input";
import { OrganizationMembersList } from "./OrganizationMembersList";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import {
    deleteOrganization,
    getSubscriptionTier,
    updateOrganizationName,
    updateOrganizationSpendLimit,
} from "@/app/actions";

const OrganizationPage = () => {
    const { createOrganization, setActive, userMemberships } =
        useOrganizationList();
    const { organization } = useOrganization();
    const { user } = useUser();
    const [newOrganizationName, setNewOrganizationName] = useState<string>("");
    const [organizationId, setOrganizationId] = useState<string>("");
    const [newMemberEmail, setNewMemberEmail] = useState<string>("");
    const [customSpendLimit, setCustomSpendLimit] = useState<number>(0.0);
    const [subscriptionTier, setSubscriptionTier] = useState<string>("");
    const [creating, setCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const initializeOrganization = async () => {
            try {
                // If no active organization but user has memberships, set the first one active
                if (
                    !organization &&
                    userMemberships.data &&
                    userMemberships?.data?.length > 0
                ) {
                    await setActive!({
                        organization: userMemberships.data[0].organization,
                    });
                    setOrganizationId(userMemberships.data[0].organization.id);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to set active organization:", error);
                setIsLoading(false);
            }
        };

        initializeOrganization();
        setOrganizationId(organization?.id ?? "");
    }, [organization, userMemberships, setActive, user]);

    useEffect(() => {
        if (user) {
            const initSubscriptionTier = async () => {
                const tier = await getSubscriptionTier(user.id);
                setSubscriptionTier(tier!);
            };
            initSubscriptionTier();
        }
    }, [user]);

    const handleCreateOrg = async () => {
        setCreating(true);
        try {
            const { id } = await createOrganization!({
                name: newOrganizationName,
            });

            setActive!({ organization: id });
        } catch (error) {
            console.error("Organization creation failed", error);
        } finally {
            setCreating(false);
        }
    };

    const handleInviteUser = async () => {
        if (!organization) return;

        try {
            await organization.inviteMember({
                emailAddress: newMemberEmail,
                role: "org:member",
            });
        } catch (error) {
            console.error("Failed to invite user:", error);
        }
    };

    const handleUpdateSpendLimit = async () => {
        try {
            await updateOrganizationSpendLimit(
                organizationId,
                customSpendLimit
            );
        } catch (error) {
            console.error("Failed to update spend limit:", error);
        }
    };

    return (
        <div className='p-6 max-w-4xl mx-auto space-y-6'>
            <div className='flex items-center gap-2 mb-6 justify-between'>
                <h2 className='text-2xl font-semibold flex gap-2 items-center'>
                    Manage{" "}
                    {!isUpdating ? (
                        <span>
                            {organization ? organization.name : "Organization"}
                        </span>
                    ) : (
                        <Input
                            placeholder='Organization name'
                            value={newOrganizationName}
                            onChange={(e) =>
                                setNewOrganizationName(e.target.value)
                            }
                            className='flex-1'
                        />
                    )}
                </h2>
                {organization && (
                    <div className='flex gap-1'>
                        <Button
                            className='bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                            onClick={async () => {
                                if (isUpdating) {
                                    if (newOrganizationName !== "") {
                                        await updateOrganizationName(
                                            organizationId,
                                            newOrganizationName
                                        );
                                    }
                                    setIsUpdating(false);
                                } else {
                                    setIsUpdating(true);
                                }
                            }}>
                            {isUpdating ? (
                                <Check className='w-4 h-4' />
                            ) : (
                                <Pen className='w-4 h-4' />
                            )}
                        </Button>
                        <Button
                            className='bg-red-500 text-white hover:bg-red-600'
                            onClick={async () => {
                                await deleteOrganization(organizationId);
                            }}>
                            <Trash className='w-4 h-4' />
                        </Button>
                    </div>
                )}
            </div>

            <div className='space-y-4'>
                {!organization && (
                    <div className='flex gap-4'>
                        <Input
                            placeholder='Organization name'
                            value={newOrganizationName}
                            onChange={(e) =>
                                setNewOrganizationName(e.target.value)
                            }
                            className='flex-1'
                        />
                        <Button
                            onClick={handleCreateOrg}
                            disabled={creating || !newOrganizationName}>
                            <Plus className='w-4 h-4 mr-2' />
                            Create Organization
                        </Button>
                    </div>
                )}

                <div className='space-y-4'>
                    {isLoading && <LoadingIndicator />}
                    {organization && (
                        <>
                            <div className='flex gap-4'>
                                <Input
                                    placeholder='Spend limit'
                                    value={customSpendLimit}
                                    onChange={(e) =>
                                        setCustomSpendLimit(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    className='flex-1'
                                />
                                <Button onClick={handleUpdateSpendLimit}>
                                    Update Spend Alert Limit
                                </Button>
                            </div>
                            {subscriptionTier !== "FREE" && (
                                <div className='flex gap-4'>
                                    <Input
                                        placeholder='User email'
                                        value={newMemberEmail}
                                        onChange={(e) =>
                                            setNewMemberEmail(e.target.value)
                                        }
                                        className='flex-1'
                                    />
                                    <Button
                                        onClick={handleInviteUser}
                                        disabled={creating || !newMemberEmail}>
                                        <Plus className='w-4 h-4 mr-2' />
                                        Invite User
                                    </Button>
                                </div>
                            )}
                            <div className='text-xl rounded-lg space-y-3'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='font-medium'>Members</h3>
                                </div>
                            </div>
                        </>
                    )}
                    <OrganizationMembersList />
                </div>
            </div>
        </div>
    );
};

export default OrganizationPage;
