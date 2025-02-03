import { auth } from "@clerk/nextjs/server";
import { ApiKeyManager } from "@/lib/apiKeys/apiKeys";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    const apiKey = await ApiKeyManager.createApiKey(userId, name);

    return NextResponse.json(apiKey);
}

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const keys = await prisma.apiKey.findMany({
        where: { userId: userId },
        select: {
            id: true,
            name: true,
            createdAt: true,
            lastUsed: true,
            enabled: true,
        },
    });

    return NextResponse.json(keys);
}

export async function DELETE(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { keyId } = await req.json();

    const apiKey = await prisma.apiKey.findUnique({
        where: { id: keyId, userId: userId },
    });

    if (!apiKey) {
        return new NextResponse("Invalid API key", { status: 401 });
    }

    await prisma.apiKey.delete({
        where: { id: keyId },
    });

    return NextResponse.json({ message: "API key deleted" });
}
