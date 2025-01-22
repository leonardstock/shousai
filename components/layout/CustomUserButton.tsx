"use client";

import { UserButton } from "@clerk/nextjs";
import { KeyRound } from "lucide-react";
import ApiKeysPage from "./ApiKeyManagementPage";

const CustomUserButton = () => {
    return (
        <>
            <UserButton>
                <UserButton.UserProfilePage
                    label='Manage API Keys'
                    labelIcon={<KeyRound />}
                    url='api-keys'>
                    <ApiKeysPage />
                </UserButton.UserProfilePage>
            </UserButton>
        </>
    );
};

export default CustomUserButton;
