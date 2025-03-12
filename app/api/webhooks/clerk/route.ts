import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { sendWelcomeEmail } from "@/lib/emails/emailUtils";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add CLERK_WEBHOOK_SECRET to your .env file");
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

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

    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const primaryEmail = email_addresses[0]?.email_address;

        try {
            const user = await prisma.user.create({
                data: {
                    id: id,
                    firstName: first_name!,
                    lastName: last_name!,
                    email: primaryEmail,
                },
            });

            await sendWelcomeEmail(user);

            return new Response("User created", { status: 200 });
        } catch (err) {
            console.error("Error creating user:", err);
            return new Response("Error creating user", { status: 500 });
        }
    }

    if (eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const primaryEmail = email_addresses[0]?.email_address;

        try {
            await prisma.user.update({
                where: { id: id },
                data: {
                    email: primaryEmail,
                    firstName: first_name!,
                    lastName: last_name!,
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

    if (eventType === "organization.created") {
        const { id, name } = evt.data;

        try {
            await prisma.organization.create({
                data: {
                    id: id,
                    name: name,
                },
            });

            await prisma.user.update({
                where: { id: id },
                data: {
                    organizationId: id,
                    role: "ADMIN",
                },
            });

            return new Response("Organization created", { status: 200 });
        } catch (err) {
            console.error("Error creating organization:", err);
            return new Response("Error creating organization", { status: 500 });
        }
    }

    if (eventType === "organization.updated") {
        const { id, name } = evt.data;

        try {
            await prisma.organization.update({
                where: { id: id },
                data: {
                    name: name,
                },
            });

            return new Response("Organization updated", { status: 200 });
        } catch (err) {
            console.error("Error updating organization:", err);
            return new Response("Error updating organization", { status: 500 });
        }
    }

    if (eventType === "organization.deleted") {
        const { id } = evt.data;

        try {
            await prisma.user.updateMany({
                where: { organizationId: id },
                data: {
                    organizationId: null,
                    role: null,
                },
            });

            await prisma.organization.delete({
                where: { id: id },
            });

            return new Response("Organization deleted", { status: 200 });
        } catch (err) {
            console.error("Error deleting organization:", err);
            return new Response("Error deleting organization", { status: 500 });
        }
    }

    if (eventType === "organizationMembership.created") {
        const { organization, public_user_data } = evt.data;

        try {
            await prisma.user.update({
                where: { id: public_user_data.user_id },
                data: {
                    organizationId: organization.id,
                    role: "MEMBER",
                },
            });

            return new Response("Organization membership created", {
                status: 200,
            });
        } catch (err) {
            console.error("Error creating organization membership:", err);
            return new Response("Error creating organization membership", {
                status: 500,
            });
        }
    }

    if (eventType === "organizationMembership.deleted") {
        const { public_user_data } = evt.data;

        try {
            await prisma.user.update({
                where: { id: public_user_data.user_id },
                data: {
                    organizationId: null,
                    role: null,
                },
            });

            return new Response("Organization membership deleted", {
                status: 200,
            });
        } catch (err) {
            console.error("Error deleting organization membership:", err);
            return new Response("Error deleting organization membership", {
                status: 500,
            });
        }
    }

    return new Response("Webhook received", { status: 200 });
}
