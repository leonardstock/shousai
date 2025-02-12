"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
                            Dashboard
                        </Link>
                        <Link
                            href='/test'
                            className={`flex items-center text-[color:--text-color] px-3 py-2 rounded-md hover:bg-blue-500/20 ${
                                currentRoute === "/test" ? "bg-blue-500/10" : ""
                            }`}>
                            Docs
                        </Link>
                    </nav>
                </div>
                {/* Rest of navigation sections... */}
            </div>
        </div>
    );
};
