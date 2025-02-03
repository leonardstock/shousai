import { Organization, User } from "@prisma/client";
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
                    <li>• Create budget alerts</li>
                </ul>
            </div>
        </EmailTemplate>
    );
};

export const CustomSpendLimitReachedEmail = ({
    organization,
    customSpendLimit,
}: {
    organization: Organization;
    customSpendLimit: number;
}) => {
    return (
        <EmailTemplate>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>
                Hi there, Your Custom Spend Limit Has Been Reached
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
                Your spend limit of ${customSpendLimit} for {organization.name}{" "}
                has been reached. You can manage your spend limit in your
                organization settings.
            </p>
            <div className='mb-8'>
                <CustomButton href={`https://shousai.co.uk/dashboard`}>
                    Manage Spend Limit
                </CustomButton>
            </div>
        </EmailTemplate>
    );
};

export const ApiCallLimitReachedEmail = ({
    organization,
    apiCallLimit,
    daily,
}: {
    organization: Organization;
    apiCallLimit: number;
    daily: boolean;
}) => {
    return (
        <EmailTemplate>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>
                Hi there, Your API Call Limit Has Been Reached
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
                Your API call limit of {apiCallLimit} for {organization.name}{" "}
                for {daily ? "today" : "this month"} has been reached. To get
                more calls consider upgrading your plan.
            </p>

            <p className='text-xl text-gray-600 mb-8'>
                Note: This only applies to the service shousai provides. Your
                API calls to OpenAI and Anthropic models are still going
                through, but will not be included in your dashboard overview or
                optimised.
            </p>

            <div className='mb-8'>
                <CustomButton href={`https://shousai.co.uk/dashboard`}>
                    See your plan
                </CustomButton>
            </div>
        </EmailTemplate>
    );
};
