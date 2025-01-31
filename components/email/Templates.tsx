import { User } from "@prisma/client";
import React from "react";
import { Tailwind, Button } from "@react-email/components";

const EmailTemplate = ({ children }: { children: React.ReactNode }) => (
    <Tailwind>
        <div className='bg-white'>
            <div className='max-w-screen-xl mx-auto px-4 py-8'>
                <div className='text-center mb-8 '>
                    <div className='logo '>
                        shous<span className='logoAi'>ai</span>
                    </div>
                </div>
                {children}
                <hr className='my-8 border-gray-200' />
                <div className='text-center text-gray-500 text-sm'>
                    <p>© 2025 Lower m Ltd. All rights reserved.</p>
                    <p className='mt-2'>
                        If you didn&apos;t request this email, please ignore it
                        or contact support.
                    </p>
                </div>
            </div>
        </div>
    </Tailwind>
);

const CustomButton = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => (
    <Button
        href={href}
        className='inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center'>
        {children}
    </Button>
);

export const WelcomeEmail = ({ user }: { user: User }) => {
    const displayName = user.firstName || user.email.split("@")[0];

    return (
        <EmailTemplate>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>
                Welcome to the Platform, {displayName}!
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
                We&apos;re excited to help you optimize your AI costs and
                improve visibility. Your account was created on{" "}
                {new Date(user.createdAt).toLocaleDateString()}.
            </p>
            <div className='mb-8'>
                <CustomButton href={`https://shousai.co.uk/dashboard`}>
                    View Your Dashboard
                </CustomButton>
            </div>
            {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8'>
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                        Monitor Usage
                    </h3>
                    <p className='text-gray-600'>
                        Track your AI costs across all providers in real-time.
                    </p>
                </div>
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                        Set Budgets
                    </h3>
                    <p className='text-gray-600'>
                        Create alerts and controls to manage spending.
                    </p>
                </div>
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                        Optimize Costs
                    </h3>
                    <p className='text-gray-600'>
                        Get intelligent suggestions to reduce spending.
                    </p>
                </div>
            </div> */}
        </EmailTemplate>
    );
};

export const DeleteAccountEmail = ({ user }: { user: User }) => {
    const displayName = user.firstName || user.email.split("@")[0];

    return (
        <EmailTemplate>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>
                Account Deletion Confirmation
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
                Hi {displayName}, we&apos;ve processed your request to delete
                your account ({user.email}). All your data has been removed from
                our systems.
            </p>
        </EmailTemplate>
    );
};

export const OrganizationCreatedEmail = ({ user }: { user: User }) => {
    const displayName = user.firstName || user.email.split("@")[0];

    return (
        <EmailTemplate>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>
                {displayName}, Your Organization is Ready!
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
                You&apos;ve successfully created your organization. Now you can
                invite team members and start managing your AI costs together.
            </p>
            <div className='mb-8'>
                <CustomButton
                    href={`https://yourplatform.com/org/${user.organizationId}/settings`}>
                    Manage Organization
                </CustomButton>
            </div>
            <div className='bg-gray-50 p-6 rounded-lg mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    Next Steps:
                </h3>
                <ul className='text-gray-600 space-y-3'>
                    <li>• Invite team members</li>
                    <li>• Set up billing preferences</li>
                    <li>• Configure monitoring settings</li>
                    <li>• Create budget alerts</li>
                </ul>
            </div>
        </EmailTemplate>
    );
};

export const OrganizationInviteEmail = ({
    user,
    invitedBy,
    orgName,
}: {
    user: User;
    invitedBy: User;
    orgName: string;
}) => {
    const inviteeDisplayName = user.firstName || user.email.split("@")[0];
    const inviterDisplayName = invitedBy.firstName
        ? `${invitedBy.firstName} ${invitedBy.lastName}`.trim()
        : invitedBy.email;

    return (
        <EmailTemplate>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>
                Hi {inviteeDisplayName}, Join {orgName} on Our Platform
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
                {inviterDisplayName} has invited you to join their organization
                to help manage and optimize AI costs.
            </p>
            <div className='mb-8'>
                <CustomButton
                    href={`https://yourplatform.com/accept-invite?uid=${user.id}&org=${invitedBy.organizationId}`}>
                    Accept Invitation
                </CustomButton>
            </div>
            <div className='bg-gray-50 p-6 rounded-lg mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                    What you&apos;ll get:
                </h3>
                <ul className='text-gray-600 space-y-3'>
                    <li>• Real-time cost monitoring</li>
                    <li>• Smart optimization suggestions</li>
                    <li>• Budget controls and alerts</li>
                    <li>• Collaboration with your team</li>
                </ul>
            </div>
        </EmailTemplate>
    );
};
