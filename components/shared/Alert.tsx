import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
    "relative w-full rounded-lg border border-l-4 p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    {
        variants: {
            variant: {
                default:
                    "border-l-slate-900 bg-white text-slate-950 dark:border-l-slate-50 dark:bg-slate-950 dark:text-slate-50",
                destructive:
                    "border-l-red-700 bg-red-50 text-red-900 dark:border-l-red-900 dark:bg-red-900/10 dark:text-red-200 [&>svg]:text-red-600",
                warning:
                    "border-l-yellow-700 bg-yellow-50 text-yellow-900 dark:border-l-yellow-900 dark:bg-yellow-900/10 dark:text-yellow-200 [&>svg]:text-yellow-600",
                success:
                    "border-l-green-700 bg-green-50 text-green-900 dark:border-l-green-900 dark:bg-green-900/10 dark:text-green-200 [&>svg]:text-green-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
    <div
        ref={ref}
        role='alert'
        className={cn(alertVariants({ variant }), className)}
        {...props}
    />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn(
            "mb-1 font-medium leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
