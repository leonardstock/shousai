"use client";

import { UserButton } from "@clerk/nextjs";
import { CreditCard, KeyRound } from "lucide-react";
import ApiKeysPage from "./ApiKeyManagementPage";
import SubscriptionPage from "./PaymentPage";

const CustomUserButton = () => {
    return (
        <>
            <UserButton>
                <UserButton.UserProfilePage
                    label='Manage API Keys'
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
            </UserButton>
        </>
    );
};

export default CustomUserButton;
