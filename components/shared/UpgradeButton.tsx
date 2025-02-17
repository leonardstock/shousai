const UpgradeButton = ({ buttonText }: { buttonText?: string }) => {
    return (
        <div className='w-full'>
            <a
                href={process.env.NEXT_PUBLIC_UPGRADE_STRIPE_URL}
                className='w-full block text-center bg-blue-500 text-white py-2 rounded-lg background-gradient font-bold'>
                {buttonText ?? "Upgrade"}
            </a>
        </div>
    );
};

export default UpgradeButton;
