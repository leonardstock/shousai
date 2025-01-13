import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
    // Get the webhook signing secret from your environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add CLERK_WEBHOOK_SECRET to your .env file");
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the webhook
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, email_addresses, ...attributes } = evt.data;
        const primaryEmail = email_addresses[0]?.email_address;

        try {
            await prisma.user.create({
                data: {
                    id: id,
                    email: primaryEmail,
                },
            });

            return new Response("User created", { status: 200 });
        } catch (err) {
            console.error("Error creating user:", err);
            return new Response("Error creating user", { status: 500 });
        }
    }

    if (eventType === "user.updated") {
        const { id, email_addresses } = evt.data;
        const primaryEmail = email_addresses[0]?.email_address;

        try {
            await prisma.user.update({
                where: { id: id },
                data: {
                    email: primaryEmail,
                },
            });

            return new Response("User updated", { status: 200 });
        } catch (err) {
            console.error("Error updating user:", err);
            return new Response("Error updating user", { status: 500 });
        }
    }

    if (eventType === "user.deleted") {
        const { id } = evt.data;

        try {
            await prisma.user.delete({
                where: { id: id },
            });

            return new Response("User deleted", { status: 200 });
        } catch (err) {
            console.error("Error deleting user:", err);
            return new Response("Error deleting user", { status: 500 });
        }
    }

    return new Response("Webhook received", { status: 200 });
}
