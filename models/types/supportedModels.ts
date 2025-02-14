// TODO: write an ai agent that automatically pulls the pricing data from the above object every 2 hours
export type Provider = "openai" | "anthropic";

export type ModelPricing = {
    provider: Provider;
    input: number;
    output: number;
};

export const MODEL_PRICING: Record<string, ModelPricing> = {
    // OpenAI Models
    "gpt-4o": {
        provider: "openai",
        input: 0.0025,
        output: 0.01,
    },
    "gpt-4o-mini": {
        provider: "openai",
        input: 0.00015,
        output: 0.0006,
    },
    "gpt-4-turbo": {
        provider: "openai",
        input: 0.01,
        output: 0.03,
    },
    "gpt-4": {
        provider: "openai",
        input: 0.03,
        output: 0.06,
    },
    "gpt-4-32k": {
        provider: "openai",
        input: 0.06,
        output: 0.12,
    },
    "gpt-3.5-turbo": {
        provider: "openai",
        input: 0.0005,
        output: 0.0015,
    },
    "gpt-3.5-turbo-instruct": {
        provider: "openai",
        input: 0.0015,
        output: 0.002,
    },
    // Anthropic Models
    "claude-3-opus-20240229": {
        provider: "anthropic",
        input: 0.015,
        output: 0.075,
    },
    "claude-3-5-sonnet-20241022": {
        provider: "anthropic",
        input: 0.003,
        output: 0.015,
    },
} as const;

export function getModelProvider(model: string): Provider | null {
    return MODEL_PRICING[model]?.provider || null;
}

export function validateModel(model: string): boolean {
    return model in MODEL_PRICING;
}

export function getModelPricing(model: string): ModelPricing | null {
    return MODEL_PRICING[model] || null;
}

export const HUMAN_READABLE_NAMES: { [key: string]: string } = {
    "gpt-4o": "GPT-4o",
    "gpt-4o-mini": "GPT-4o Mini",
    "gpt-4-32k": "GPT-4 32K",
    "gpt-4-turbo": "GPT-4 (Turbo)",
    "gpt-4": "GPT-4",
    "gpt-3.5-turbo": "GPT-3.5 Turbo",
    "gpt-3.5-turbo-instruct": "GPT-3.5 Turbo Instruct",
    "claude-3-opus-20240229": "Claude 3 Opus",
    "claude-3-5-sonnet-20241022": "Claude 3.5 Sonnet",
};

export const HUMAN_READABLE_PROVIDER_NAMES: { [key: string]: string } = {
    openai: "OpenAI",
    anthropic: "Anthropic",
};

export type SupportedModel = keyof typeof MODEL_PRICING;
