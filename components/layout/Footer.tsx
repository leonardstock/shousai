import Link from "next/link";

const Footer = () => {
    return (
        <div
            className='w-full flex flex-row justify-between items-center p-6 py-3'
            style={{ backgroundColor: "#000000" }}>
            <div className='flex flex-row'>
                <div>© 2025 Lower m Ltd. • All rights reserved</div>
            </div>
            <div className='flex flex-row items-center gap-4'>
                <Link href='#'>Privacy Policy</Link>

                <Link href='#'>Terms of Use</Link>
            </div>
        </div>
    );
};

export default Footer;
