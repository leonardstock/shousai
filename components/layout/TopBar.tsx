import { signInEnabled } from "@/global";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const TopBar = () => {
    return (
        <div
            className='w-full flex flex-row justify-between items-center sticky p-6 py-3'
            style={{ top: 0, backgroundColor: "#000000", zIndex: 100 }}>
            <Link href='/'>
                <div className='logo'>
                    shous<span className='logoAi'>ai</span>
                </div>
            </Link>
            <div className='flex flex-row gap-4'>
                <Link href='/pricing'>Pricing</Link>
                {signInEnabled && (
                    <>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </>
                )}
            </div>
        </div>
    );
};

export default TopBar;
