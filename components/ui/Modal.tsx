import React from "react";
import { X } from "lucide-react";

export const Modal = ({
    title,
    children,
    buttons,
    onClose,
}: {
    title: string;
    children: React.ReactNode;
    buttons: React.ReactNode;
    onClose: () => void;
}) => {
    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full space-y-4'>
                <div className='flex justify-between items-center'>
                    <h3 className='text-lg font-semibold'>{title}</h3>
                    <button
                        onClick={onClose}
                        className='text-gray-500 hover:text-gray-700'>
                        <X className='w-5 h-5' />
                    </button>
                </div>

                {children}

                <div className='flex justify-end gap-3'>{buttons}</div>
            </div>
        </div>
    );
};
