/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserFromApiKey, handleCheckCustomSpendLimit } from "@/app/actions";
import { ApiKeyManager } from "@/lib/apiKeys/apiKeys";
import { createRequestCache } from "@/lib/cache/requestCache";
import { prisma } from "@/lib/db/prisma";
import { TokenCalculator } from "@/lib/tokens/calculator";
import { UsageManager } from "@/lib/usage/usageManager";
import { CacheEntry } from "@/models/interfaces/cache";
import {
    getModelProvider,
    SupportedModel,
    validateModel,
} from "@/models/types/supportedModels";
import { NextResponse } from "next/server";
import { z } from "zod";

// Request validation schema
const requestSchema = z.object({
    apiKey: z.string().min(1, "API key is required"),
    providerKey: z.string().min(1, "Provider API key is required"),
    maxTokens: z.number().optional(),
    model: z.string().min(1, "Model is required"),
    noCache: z.boolean().optional(),
    messages: z
        .array(
            z.object({
                role: z.string(),
                content: z.string(),
            })
        )
        .min(1, "At least one message is required"),
});

// Provider-specific API configurations
const PROVIDER_CONFIGS = {
    openai: {
        url: "https://api.openai.com/v1/chat/completions",
        headers: (providerKey: string) => ({
            Authorization: `Bearer ${providerKey}`,
            "Content-Type": "application/json",
        }),
        formatRequest: (model: string, messages: any[]) => ({
            model,
            messages,
        }),
        extractContent: (data: any) => data.choices[0].message.content,
    },
    anthropic: {
        url: "https://api.anthropic.com/v1/messages",
        headers: (providerKey: string) => ({
            "x-api-key": providerKey,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }),
        formatRequest: (
            model: string,
            messages: any[],
            maxTokens: number | undefined
        ) => ({
            model,
            max_tokens: maxTokens ?? 1024,
            messages: messages.map((msg) => ({
                role: msg.role === "user" ? "user" : "assistant",
                content: msg.content,
            })),
        }),
        extractContent: (data: any) => data.content[0].text,
    },
};

export async function POST(req: Request) {
    try {
        const { apiKey, providerKey, model, maxTokens, messages, noCache } =
            requestSchema.parse(await req.json());

        if (!process.env.UPSTASH_REDIS_REST_URL) {
            throw new Error("Cache configuration missing");
        }

        const validKey = await ApiKeyManager.validateApiKey(apiKey);
        if (!validKey) {
            return new NextResponse("Invalid API key", { status: 401 });
        }

        const userInfo = await getUserFromApiKey(apiKey);
        if (!userInfo) {
            return new NextResponse("User not found", { status: 401 });
        }
        const { userId } = userInfo;

        if (!validateModel(model)) {
            return new NextResponse(`Unsupported model: ${model}`, {
                status: 500,
            });
        }

        const provider = getModelProvider(model);
        if (!provider) {
            return new NextResponse(`Unsupported model: ${model}`, {
                status: 500,
            });
        }

        const cache = createRequestCache(process.env.UPSTASH_REDIS_REST_URL);

        // Calculate estimated tokens
        const tokenCount = TokenCalculator.countTokens(
            messages,
            model as SupportedModel
        );

        const { isUsageLimited, reason } =
            await UsageManager.checkUsageLimit(userId);

        if (!noCache && !isUsageLimited) {
            // Check cache with timeout
            const cachedResult = await Promise.race<CacheEntry | null>([
                cache.getCachedResponse(messages, model, provider),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Cache read timeout")),
                        2000
                    )
                ),
            ]).catch((error) => {
                console.error("Cache read error:", error);
                return null;
            });

            if (cachedResult) {
                try {
                    // Update cache stats with error handling
                    await Promise.race([
                        cache.updateCacheStats(
                            userId,
                            true,
                            cachedResult.tokenCount.cost
                        ),
                        new Promise((_, reject) =>
                            setTimeout(
                                () => reject(new Error("Stats update timeout")),
                                1000
                            )
                        ),
                    ]).catch((error) => {
                        console.error("Stats update error:", error);
                    });

                    // Log cached usage
                    await prisma.usageLog.create({
                        data: {
                            userId,
                            model,
                            provider,
                            inputTokens: cachedResult.tokenCount.inputTokens,
                            outputTokens: cachedResult.tokenCount.outputTokens,
                            cost: cachedResult.tokenCount.cost,
                            success: true,
                            cached: true,
                        },
                    });

                    return NextResponse.json({
                        ...cachedResult.response,
                        usage: {
                            ...cachedResult.tokenCount,
                            estimated_cost: "0.0000 (cached)",
                            cached: true,
                        },
                    });
                } catch (error) {
                    console.error("Error processing cached result:", error);
                    // Fall through to API call if cache processing fails
                }
            }
        }

        // Make API call
        const providerConfig = PROVIDER_CONFIGS[provider];
        const response = await fetch(providerConfig.url, {
            method: "POST",
            headers: providerConfig.headers(providerKey),
            body: JSON.stringify(
                providerConfig.formatRequest(model, messages, maxTokens)
            ),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return new NextResponse(
                JSON.stringify({
                    error: "Provider API error",
                    details: errorData,
                }),
                { status: response.status }
            );
        }

        const data = await response.json();
        const outputContent = providerConfig.extractContent(data);

        // Update token count with actual output
        const finalTokenCount = TokenCalculator.updateWithActualOutput(
            tokenCount,
            outputContent,
            model as SupportedModel
        );

        if (!noCache && !isUsageLimited) {
            // Cache the response with error handling
            await Promise.race([
                cache.cacheResponse(
                    messages,
                    model,
                    provider,
                    data,
                    finalTokenCount
                ),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Cache write timeout")),
                        2000
                    )
                ),
            ]).catch((error) => {
                console.error("Cache write error:", error);
            });

            // Update cache stats
            await Promise.race([
                cache.updateCacheStats(userId, false),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Stats update timeout")),
                        1000
                    )
                ),
            ]).catch((error) => {
                console.error("Stats update error:", error);
            });
        }

        if (!isUsageLimited) {
            // Log usage
            await prisma.usageLog.create({
                data: {
                    userId,
                    model,
                    provider,
                    inputTokens: finalTokenCount.inputTokens,
                    outputTokens: finalTokenCount.outputTokens,
                    cost: finalTokenCount.cost,
                    success: true,
                    cached: false,
                },
            });

            await handleCheckCustomSpendLimit(userId);

            return NextResponse.json({
                ...data,
            });
        }

        return NextResponse.json({
            ...data,
            system_message: `shousai not active: ${reason}`,
        });
    } catch (error) {
        console.error("Proxy error:", error);

        return new NextResponse(
            error instanceof z.ZodError
                ? JSON.stringify({
                      error: "Invalid request data",
                      details: error.errors,
                  })
                : "Internal server error",
            { status: error instanceof z.ZodError ? 400 : 500 }
        );
    }
}
