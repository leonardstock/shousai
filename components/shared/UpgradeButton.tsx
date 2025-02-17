"use client";

import { useUser } from "@clerk/nextjs";

const UpgradeButton = ({ buttonText }: { buttonText?: string }) => {
    const { user } = useUser();
    const userEmail = user?.emailAddresses[0].emailAddress;

    return (
        <div className='w-full'>
            <a
                href={`${process.env.NEXT_PUBLIC_UPGRADE_STRIPE_URL}?prefilled_email=${encodeURI(userEmail!)}`}
                className='w-full block text-center bg-blue-500 text-white py-2 rounded-lg background-gradient font-bold'>
                {buttonText ?? "Upgrade"}
            </a>
        </div>
    );
};

export default UpgradeButton;
