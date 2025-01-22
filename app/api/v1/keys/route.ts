import { auth } from "@clerk/nextjs/server";
import { ApiKeyManager } from "@/lib/apiKeys/apiKeys";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, usageLimit } = await req.json();

    const apiKey = await ApiKeyManager.createApiKey(orgId, name, usageLimit);

    return NextResponse.json(apiKey);
}

export async function GET() {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const keys = await prisma.apiKey.findMany({
        where: { organizationId: orgId },
        select: {
            id: true,
            name: true,
            createdAt: true,
            lastUsed: true,
            enabled: true,
            usageLimit: true,
        },
    });

    return NextResponse.json(keys);
}
