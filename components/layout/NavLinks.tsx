"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = () => {
    const currentRoute = usePathname();

    return (
        <>
            <Link
                href='/dashboard'
                className={`navLink ${
                    currentRoute === "/dashboard" ? "active" : ""
                }`}>
                <div className='landing-nav-link'>Dashboard</div>
            </Link>
            <Link
                href='/reference'
                className={`navLink ${
                    currentRoute === "/reference" ? "active" : ""
                }`}>
                <div className='landing-nav-link'>API Reference</div>
            </Link>
        </>
    );
};

export default NavLinks;
