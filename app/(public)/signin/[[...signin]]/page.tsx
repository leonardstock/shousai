import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className='flex justify-center my-5 flex-1'>
            <SignIn />
        </div>
    );
}
