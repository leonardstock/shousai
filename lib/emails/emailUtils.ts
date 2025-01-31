import { WelcomeEmail } from "@/components/email/Templates";
import { User } from "@prisma/client";
import { JSX } from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Email = {
    to: string[];
    subject: string;
    body: JSX.Element;
};

export const sendEmail = async ({ to, subject, body }: Email) => {
    try {
        const emailBulk = [];
        const toCopy = [...to];

        while (toCopy.length > 0) {
            emailBulk.push(toCopy.splice(0, 50));
        }

        for (const emailPackage of emailBulk) {
            try {
                await resend.emails.send({
                    from: "shousai <hello@shousai.co.uk>",
                    to: emailPackage,
                    subject: subject,
                    react: body,
                });
            } catch (error) {
                console.error({ error });
                continue;
            }
        }
    } catch (error) {
        console.error({ error });
    }
};

export const sendWelcomeEmail = async (user: User) => {
    await sendEmail({
        to: [user.email],
        subject: "Welcome to shousai",
        body: WelcomeEmail({ user }),
    });
};
