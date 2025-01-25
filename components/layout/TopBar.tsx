import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import CustomUserButton from "./CustomUserButton";

const TopBar = async () => {
    const { userId } = await auth();

    return (
        <div
            className='w-full flex flex-row justify-between items-center sticky p-6 py-3'
            style={{ top: 0, backgroundColor: "#000000", zIndex: 100 }}>
            <div className='flex flex-row gap-4 text-white items-center'>
                <Link href='/'>
                    <div className='logo'>
                        shous<span className='logoAi'>ai</span>
                    </div>
                </Link>
                {userId && (
                    <div className='flex flex-row gap-4 text-white ms-10 '>
                        <Link href='/dashboard' className='navLink'>
                            Dashboard
                        </Link>
                        <Link href='/dashboard' className='navLink'>
                            Optimization
                        </Link>
                        <Link href='/pricing' className='navLink'>
                            Pricing
                        </Link>
                    </div>
                )}
            </div>
            <div className='flex flex-row gap-4 text-white'>
                {!userId && <Link href='/pricing'>Pricing</Link>}
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
    );
};

export default TopBar;
