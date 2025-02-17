"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ArrowUpRight, Building2, CreditCard, KeyRound } from "lucide-react";
import ApiKeysPage from "./ApiKeyManagementPage";
import OrganizationPage from "./manageOrganization/OrganizationPage";
import { useEffect, useState } from "react";
import { getUserRole } from "@/app/actions";
import { getSubscriptionTier } from "@/actions/subscriptions";

const CustomUserButton = () => {
    const { user } = useUser();
    const [isAdmin, setIsAdmin] = useState(true);
    const [isOnFreeTier, setIsOnFreeTier] = useState(true);
    const userEmail = user?.emailAddresses[0].emailAddress;

    useEffect(() => {
        const checkRole = async () => {
            if (user) {
                const role = await getUserRole(user.id);
                setIsAdmin(role === "ADMIN");
                const subscriptionTier = await getSubscriptionTier(user.id);
                setIsOnFreeTier(subscriptionTier === "FREE");
            }
        };
        checkRole();
    }, [user]);

    return (
        <>
            <UserButton>
                <UserButton.MenuItems>
                    {isAdmin &&
                        (isOnFreeTier ? (
                            <UserButton.Link
                                label='Upgrade to Pro'
                                labelIcon={
                                    <ArrowUpRight
                                        height={"1rem"}
                                        width={"1rem"}
                                    />
                                }
                                href={`${process.env.NEXT_PUBLIC_UPGRADE_STRIPE_URL}?prefilled_email=${encodeURI(userEmail!)}`}></UserButton.Link>
                        ) : (
                            <UserButton.Link
                                label='Manage Subscription'
                                labelIcon={
                                    <CreditCard
                                        height={"1rem"}
                                        width={"1rem"}
                                    />
                                }
                                href='https://billing.stripe.com/p/login/test_8wM009aSRg0v4mI8ww'></UserButton.Link>
                        ))}
                </UserButton.MenuItems>
                <UserButton.UserProfilePage
                    label='Manage API Key'
                    labelIcon={<KeyRound height={"1rem"} width={"1rem"} />}
                    url='api-keys'>
                    <ApiKeysPage />
                </UserButton.UserProfilePage>
                <UserButton.UserProfilePage
                    label='Manage Organization'
                    labelIcon={<Building2 height={"1rem"} width={"1rem"} />}
                    url='organization'>
                    <OrganizationPage />
                </UserButton.UserProfilePage>
            </UserButton>
        </>
    );
};

export default CustomUserButton;
