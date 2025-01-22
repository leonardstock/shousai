import { encode } from "gpt-tokenizer";
import { MODEL_PRICING, SupportedModel } from "@/models/types/supportedModels";
import { PrismaClient } from "@prisma/client";

interface Message {
    role: string;
    content: string;
}

interface TokenCount {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cost: number;
}

interface UsageLogParams {
    userId: string;
    provider: string;
    model: SupportedModel;
    tokenCount: TokenCount;
    success: boolean;
    cached: boolean;
    apiKeyId: string;
}

export class TokenCalculator {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    static countTokens(messages: Message[], model: SupportedModel): TokenCount {
        let inputTokens = 0;

        try {
            // Count tokens in messages
            for (const message of messages) {
                // Add tokens for message content
                inputTokens += encode(message.content).length;

                // Add tokens for role (standard overhead per message)
                inputTokens += encode(message.role).length;

                // Add tokens for message format overhead
                inputTokens += 3; // Approximately 3 tokens per message for format markers
            }

            // For now, we'll estimate output tokens as 50% of input
            const estimatedOutputTokens = Math.ceil(inputTokens * 0.5);

            // Calculate costs
            const pricing = MODEL_PRICING[model];
            const inputCost = (inputTokens / 1000) * pricing.input;
            const outputCost = (estimatedOutputTokens / 1000) * pricing.output;

            return {
                inputTokens,
                outputTokens: estimatedOutputTokens,
                totalTokens: inputTokens + estimatedOutputTokens,
                cost: inputCost + outputCost,
            };
        } catch (error) {
            console.error("Error counting tokens:", error);
            throw new Error("Failed to count tokens");
        }
    }

    static updateWithActualOutput(
        tokenCount: TokenCount,
        outputContent: string,
        model: SupportedModel
    ): TokenCount {
        try {
            const actualOutputTokens = encode(outputContent).length;
            const pricing = MODEL_PRICING[model];

            return {
                inputTokens: tokenCount.inputTokens,
                outputTokens: actualOutputTokens,
                totalTokens: tokenCount.inputTokens + actualOutputTokens,
                cost:
                    (tokenCount.inputTokens / 1000) * pricing.input +
                    (actualOutputTokens / 1000) * pricing.output,
            };
        } catch (error) {
            console.error("Error updating token count:", error);
            throw new Error("Failed to update token count with actual output");
        }
    }

    async logUsage({
        userId,
        provider,
        model,
        tokenCount,
        success,
        cached,
        apiKeyId,
    }: UsageLogParams): Promise<void> {
        try {
            await this.prisma.usageLog.create({
                data: {
                    userId,
                    provider,
                    model,
                    inputTokens: tokenCount.inputTokens,
                    outputTokens: tokenCount.outputTokens,
                    cost: tokenCount.cost,
                    success,
                    cached,
                    apiKeyId,
                },
            });
        } catch (error) {
            console.error("Error logging usage:", error);
            // Log the error but don't throw - we don't want to break the main flow if logging fails
        }
    }

    async getUserStats(userId: string, days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        try {
            const stats = await this.prisma.usageLog.groupBy({
                by: ["model"],
                where: {
                    userId,
                    createdAt: {
                        gte: startDate,
                    },
                },
                _sum: {
                    inputTokens: true,
                    outputTokens: true,
                    cost: true,
                },
                _count: true,
            });

            return stats;
        } catch (error) {
            console.error("Error fetching user stats:", error);
            throw new Error("Failed to fetch usage statistics");
        }
    }

    async getDailyUsage(userId: string, days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        try {
            return await this.prisma.$queryRaw`
                SELECT 
                    DATE(created_at) as date,
                    SUM(input_tokens) as total_input_tokens,
                    SUM(output_tokens) as total_output_tokens,
                    SUM(cost) as total_cost
                FROM usage_log
                WHERE user_id = ${userId}
                AND created_at >= ${startDate}
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            `;
        } catch (error) {
            console.error("Error fetching daily usage:", error);
            throw new Error("Failed to fetch daily usage data");
        }
    }
}
