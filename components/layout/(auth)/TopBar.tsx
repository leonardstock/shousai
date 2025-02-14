"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import CustomUserButton from "../CustomUserButton";
import { usePathname, useRouter } from "next/navigation";

export default function TopBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const router = useRouter();
    const currentRoute = usePathname();

    const handleNavigation = useCallback(
        (path: string) => {
            setMobileMenuOpen(false);
            setTimeout(() => {
                router.push(path);
            }, 50);
        },
        [router]
    );

    return (
        <header className='bg-white'>
            <nav
                aria-label='Global'
                className='mx-auto flex items-center justify-between p-4'>
                <div className='flex lg:flex-1'>
                    <Link href='/'>
                        <div className='logo'>
                            shous<span className='logoAi'>ai</span>
                        </div>
                    </Link>
                </div>
                <div className='flex lg:hidden'>
                    <button
                        type='button'
                        onClick={() => setMobileMenuOpen(true)}
                        className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'>
                        <span className='sr-only'>Open main menu</span>
                        <Menu aria-hidden='true' className='size-6' />
                    </button>
                </div>
                <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
                    <div className={`flex flex-row`}>
                        <>
                            <SignedOut>
                                <SignInButton>
                                    <button className='background-gradient text-white items-center lg:px-6 px-4 py-2 rounded-lg'>
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <CustomUserButton />
                            </SignedIn>
                        </>
                    </div>
                </div>
            </nav>
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className='lg:hidden'>
                <div className='fixed inset-0 z-10' />
                <DialogPanel className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white p-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
                    <div className='flex items-center justify-between'>
                        <div
                            onClick={() => {
                                handleNavigation("/");
                            }}>
                            <div className='logo'>
                                shous<span className='logoAi'>ai</span>
                            </div>
                        </div>
                        <button
                            type='button'
                            onClick={() => setMobileMenuOpen(false)}
                            className='-m-2.5 rounded-md p-2.5 text-gray-700'>
                            <span className='sr-only'>Close menu</span>
                            <X aria-hidden='true' className='size-6' />
                        </button>
                    </div>
                    <div className='mt-6 flow-root'>
                        <div className='-my-6 divide-y divide-gray-500/10'>
                            <div className='space-y-2 py-6'>
                                <div
                                    onClick={() =>
                                        handleNavigation("/dashboard")
                                    }>
                                    <div
                                        className={`landing-nav-link navLink py-2 w-fit ${
                                            currentRoute === "/dashboard"
                                                ? "active"
                                                : ""
                                        }`}>
                                        Dashboard
                                    </div>
                                </div>
                                <div onClick={() => handleNavigation("/logs")}>
                                    <div
                                        className={`landing-nav-link navLink py-2 w-fit ${
                                            currentRoute === "/reference"
                                                ? "active"
                                                : ""
                                        }`}>
                                        Usage Logs
                                    </div>
                                </div>
                            </div>
                            <div className='py-6'>
                                <div className={`flex flex-row gap-4`}>
                                    <CustomUserButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
