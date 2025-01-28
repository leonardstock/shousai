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
                Dashboard
            </Link>
            <Link
                href='/reference'
                className={`navLink ${
                    currentRoute === "/reference" ? "active" : ""
                }`}>
                API Reference
            </Link>
        </>
    );
};

export default NavLinks;
