import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import CustomUserButton from "./CustomUserButton";
import NavLinks from "./NavLinks";

const TopBar = async () => {
    const { userId } = await auth();

    return (
        <div
            className='w-full sticky'
            style={{ top: 0, backgroundColor: "white", zIndex: 100 }}>
            <div className='max-w-screen-xl py-3 p-4 mx-auto flex flex-row justify-between items-center'>
                <div className='flex flex-row gap-8 text-white items-center'>
                    <Link href='/'>
                        <div className='logo'>
                            shous<span className='logoAi'>ai</span>
                        </div>
                    </Link>
                    <div className='flex flex-row gap-5 text-white items-center'>
                        {userId && (
                            <div className='flex flex-row gap-4 ms-10 '>
                                <NavLinks />
                            </div>
                        )}
                        <div className='flex flex-row gap-4 ms-10'>
                            {!userId && (
                                <Link href='/reference'>
                                    <div className='landing-nav-link navLink'>
                                        Guide
                                    </div>
                                </Link>
                            )}
                            {!userId && (
                                <Link href='/pricing'>
                                    <div className='landing-nav-link navLink'>
                                        Pricing
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className={`flex flex-row gap-4 ${
                        userId
                            ? ""
                            : "background-gradient text-white items-center px-6 py-2 rounded-lg"
                    }`}>
                    <>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <CustomUserButton />
                        </SignedIn>
                    </>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
