import Link from "next/link";

const Footer = () => {
    return (
        <div
            className='w-full p-6 lg:py-3'
            style={{ backgroundColor: "rgb(40, 40, 40)" }}>
            <div className='max-w-screen-xl mx-auto lg:flex flex-row justify-between items-center'>
                <div className='flex flex-row mb-2 lg:mb-0'>
                    <div style={{ color: "#ffffff" }}>
                        © 2025 Lower m Ltd. &bull; All rights reserved
                    </div>
                </div>
                <div
                    className='flex flex-col lg:flex-row  items-center lg:gap-4 gap-2'
                    style={{ color: "#ffffff" }}>
                    <Link href='/privacy'>Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;
