export const Card = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-full p-6 space-y-6 bg-white rounded-lg border border-gray-200'>
            {children}
        </div>
    );
};

export const CardHeader = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={`flex flex-row items-center justify-between pb-2 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={`text-sm font-medium ${className}`}>{children}</div>;
};

export const CardContent = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={`${className}`}>{children}</div>;
};
