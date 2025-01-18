import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className='flex flex-col items-center justify-center mt-5'>
            <SignUp />
        </div>
    );
}
