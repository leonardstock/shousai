"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Logs } from "lucide-react";

export const Sidebar = () => {
    const currentRoute = usePathname();

    return (
        <div className='w-64 md:block hidden'>
            {/* Navigation */}
            <div className='p-4'>
                {/* Settings section */}
                <div className='mb-8'>
                    <h3 className='text-xs font-semibold text-gray-400 mb-4'>
                        GENERAL
                    </h3>
                    <nav className='space-y-2'>
                        <Link
                            href='/dashboard'
                            className={`flex items-center text-[color:--text-color] px-3 py-2 rounded-md hover:bg-blue-500/20 ${
                                currentRoute === "/dashboard"
                                    ? "bg-blue-500/10"
                                    : ""
                            }`}>
                            <House className='mr-2 h-4 w-4' />
                            Dashboard
                        </Link>
                        <Link
                            href='/logs'
                            className={`flex items-center text-[color:--text-color] px-3 py-2 rounded-md hover:bg-blue-500/20 ${
                                currentRoute === "/logs" ? "bg-blue-500/10" : ""
                            }`}>
                            <Logs className='mr-2 h-4 w-4' />
                            Usage Logs
                        </Link>
                    </nav>
                </div>
                {/* Rest of navigation sections... */}
            </div>
        </div>
    );
};
