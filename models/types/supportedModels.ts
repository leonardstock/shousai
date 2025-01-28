// TODO: write an ai agent that automatically pulls the pricing data from the above object every 2 hours

export const MODEL_PRICING = {
    // OpenAI Models
    "gpt-4-turbo-preview": {
        input: 0.01,
        output: 0.03,
    },
    "gpt-4": {
        input: 0.03,
        output: 0.06,
    },
    "gpt-3.5-turbo": {
        input: 0.0005,
        output: 0.0015,
    },
    "gpt-3.5-turbo-instruct": {
        input: 0.0005,
        output: 0.0015,
    },
    // Anthropic Models
    "claude-3-opus-20240229": {
        input: 0.015,
        output: 0.075,
    },
    "claude-3-sonnet-20240229": {
        input: 0.003,
        output: 0.015,
    },
} as const;

export const HUMAN_READABLE_NAMES: { [key: string]: string } = {
    "gpt-4-turbo-preview": "GPT-4 Turbo (Preview)",
    "gpt-4": "GPT-4",
    "gpt-3.5-turbo": "GPT-3.5 Turbo",
    "gpt-3.5-turbo-instruct": "GPT-3.5 Turbo Instruct",
    "claude-3-opus-20240229": "Claude 3 Opus",
    "claude-3-sonnet-20240229": "Claude 3 Sonnet",
};

export type SupportedModel = keyof typeof MODEL_PRICING;
