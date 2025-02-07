import Link from "next/link";

const Footer = () => {
    return (
        <div className='w-full' style={{ backgroundColor: "rgb(40, 40, 40)" }}>
            <div className='max-w-screen-xl mx-auto flex lg:flex-row flex-col justify-between items-center p-6 lg:py-3'>
                <div className='flex flex-row mb-2 lg:mb-0'>
                    <div className='text-white text-xs'>
                        © 2025 Shousai Ltd. All rights reserved.
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row items-center lg:gap-4 gap-2 text-xs'>
                    <Link
                        href='/privacy'
                        className='text-gray-300 hover:text-white'>
                        Privacy Policy
                    </Link>
                    <a
                        href='#'
                        className='termly-display-preferences text-gray-300 hover:text-white'>
                        Cookie Preferences
                    </a>
                    <Link
                        href={"/terms"}
                        className='text-gray-300 hover:text-white'>
                        Terms and Conditions
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;
