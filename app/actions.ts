"use server";

import { prisma } from "@/lib/db/prisma";

export async function handleEarlyAccessSubmit(email: string) {
    try {
        await prisma.earlyAccess.create({
            data: {
                email: email,
            },
        });

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
