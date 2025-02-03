"use client";

import { UserButton } from "@clerk/nextjs";
import { Building2, CreditCard, KeyRound } from "lucide-react";
import ApiKeysPage from "./ApiKeyManagementPage";
import SubscriptionPage from "./PaymentPage";
import OrganizationPage from "./manageOrganization/OrganizationPage";

const CustomUserButton = () => {
    return (
        <>
            <UserButton>
                <UserButton.UserProfilePage
                    label='Manage API Key'
                    labelIcon={<KeyRound height={"1rem"} width={"1rem"} />}
                    url='api-keys'>
                    <ApiKeysPage />
                </UserButton.UserProfilePage>
                <UserButton.UserProfilePage
                    label='Manage Subscription'
                    labelIcon={<CreditCard height={"1rem"} width={"1rem"} />}
                    url='payments'>
                    <SubscriptionPage />
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
