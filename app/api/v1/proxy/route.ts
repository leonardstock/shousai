import { prisma } from "@/lib/db/prisma";
import { TokenCalculator } from "@/lib/tokens/calculator";
import { SupportedModel } from "@/models/types/supportedModels";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { apiKey, provider, model, messages } = await req.json();

        // Calculate estimated tokens before making the API call
        const tokenCount = TokenCalculator.countTokens(
            messages,
            model as SupportedModel
        );

        // Make API call
        let response;
        if (provider === "openai") {
            response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model,
                        messages,
                    }),
                }
            );
        } else if (provider === "anthropic") {
            response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model,
                    messages,
                }),
            });
        }

        const data = await response?.json();

        // Update token count with actual output
        const finalTokenCount = TokenCalculator.updateWithActualOutput(
            tokenCount,
            data.choices[0].message.content,
            model as SupportedModel
        );

        // Track usage
        await prisma.usageLog.create({
            data: {
                userId,
                model,
                inputTokens: finalTokenCount.inputTokens,
                outputTokens: finalTokenCount.outputTokens,
                cost: finalTokenCount.cost,
                success: true,
                provider,
            },
        });

        // Add token and cost information to response
        return NextResponse.json({
            ...data,
            usage: {
                ...finalTokenCount,
                estimated_cost: finalTokenCount.cost.toFixed(4),
            },
        });
    } catch (error) {
        console.error("Proxy error:", error);
        return new NextResponse("Error processing request", { status: 500 });
    }
}
