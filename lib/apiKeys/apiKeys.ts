import { randomBytes, createHash } from "crypto";
import { prisma } from "../db/prisma";

export class ApiKeyManager {
    // Generate a new API key
    static async createApiKey(
        userId: string,
        name: string,
        usageLimit?: number
    ) {
        // Generate random key with prefix for easy identification
        const randomKey = `sk-${randomBytes(24).toString("hex")}`;

        // Hash the key for storage
        const hashedKey = this.hashApiKey(randomKey);

        const apiKey = await prisma.apiKey.create({
            data: {
                key: hashedKey,
                name,
                userId,
                usageLimit,
            },
        });

        // Return the unhashed key only once
        return {
            id: apiKey.id,
            key: randomKey,
            name: apiKey.name,
        };
    }

    // Validate an API key
    static async validateApiKey(key: string) {
        const hashedKey = this.hashApiKey(key);

        const apiKey = await prisma.apiKey.findUnique({
            where: { key: hashedKey },
        });

        if (!apiKey || !apiKey.enabled) {
            return null;
        }

        // Check usage limits if they exist
        if (apiKey.usageLimit) {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const monthlyUsage = await prisma.usageLog.count({
                where: {
                    apiKeyId: apiKey.id,
                    createdAt: {
                        gte: startOfMonth,
                    },
                },
            });

            if (monthlyUsage >= apiKey.usageLimit) {
                return null;
            }
        }

        // Update last used timestamp
        await prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { lastUsed: new Date() },
        });

        return apiKey;
    }

    // Hash API key for storage
    private static hashApiKey(key: string) {
        return createHash("sha256").update(key).digest("hex");
    }
}
