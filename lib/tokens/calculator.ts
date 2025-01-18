import { MODEL_PRICING, SupportedModel } from "@/models/types/supportedModels";
import { encode } from "gpt-tokenizer";

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

export class TokenCalculator {
    static countTokens(messages: Message[], model: SupportedModel): TokenCount {
        let inputTokens = 0;

        // Count tokens in messages
        for (const message of messages) {
            // Add tokens for message content
            inputTokens += encode(message.content).length;

            // Add tokens for role (standard overhead per message)
            inputTokens += encode(message.role).length;

            // Add tokens for message format overhead
            // This varies by model but we'll use conservative estimates
            inputTokens += 3; // Approximately 3 tokens per message for format markers
        }

        // For now, we'll estimate output tokens as 50% of input
        // This can be updated with actual response later
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
    }

    static updateWithActualOutput(
        tokenCount: TokenCount,
        outputContent: string,
        model: SupportedModel
    ): TokenCount {
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
    }
}
