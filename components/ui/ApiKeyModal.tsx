"use client";

import { useState } from "react";
import { Copy, X } from "lucide-react";
import { Button } from "../shared/Button";

export const ApiKeyModal = ({
    apiKey,
    onClose,
}: {
    apiKey: string;
    onClose: () => void;
}) => {
    const [copied, setCopied] = useState(false);

    const copyKey = async () => {
        await navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full space-y-4'>
                <div className='flex justify-between items-center'>
                    <h3 className='text-lg font-semibold'>
                        New API Key Created
                    </h3>
                    <button
                        onClick={onClose}
                        className='text-gray-500 hover:text-gray-700'>
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <div className='space-y-2'>
                    <p className='text-sm text-red-600 font-medium'>
                        Save this API key now. You won`&apos;t be able to see it
                        again!
                    </p>
                    <div className='bg-gray-100 p-3 rounded-md break-all font-mono text-sm'>
                        {apiKey}
                    </div>
                </div>

                <div className='flex justify-end gap-3'>
                    <Button onClick={copyKey} variant='outline'>
                        <Copy className='w-4 h-4 mr-2' />
                        {copied ? "Copied!" : "Copy Key"}
                    </Button>
                    <Button onClick={onClose}>Done</Button>
                </div>
            </div>
        </div>
    );
};
