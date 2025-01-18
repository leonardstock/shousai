import { encode } from "@nem035/gpt-3-encoder";

interface OptimizationResult {
    originalTokenCount: number;
    optimizedTokenCount: number;
    optimizedPrompt: string;
    savings: number;
    optimizations: string[];
}

export class PromptOptimizer {
    private static commonPrefixes = [
        "Please ",
        "Can you ",
        "I want you to ",
        "I would like you to ",
        "You should ",
    ];

    private static commonSuffixes = [
        " please",
        " if you can",
        " if possible",
        " thanks",
        " thank you",
    ];

    private static verboseConstructs = new Map([
        [/(in order to)/g, "to"],
        [/(due to the fact that)/g, "because"],
        [/(at this point in time)/g, "now"],
        [/(in the event that)/g, "if"],
        [/(on the basis of)/g, "based on"],
        [/(in spite of the fact that)/g, "although"],
    ]);

    static optimize(prompt: string): OptimizationResult {
        const originalTokenCount = this.countTokens(prompt);
        const optimizations: string[] = [];
        let optimizedPrompt = prompt.toLowerCase();

        // Remove unnecessary prefixes
        // const originalLength = optimizedPrompt.length;
        for (const prefix of this.commonPrefixes) {
            if (optimizedPrompt.startsWith(prefix)) {
                optimizedPrompt = optimizedPrompt.slice(prefix.length);
                optimizations.push(`Removed unnecessary prefix: "${prefix}"`);
                break;
            }
        }

        // Remove unnecessary suffixes
        for (const suffix of this.commonSuffixes) {
            if (optimizedPrompt.endsWith(suffix)) {
                optimizedPrompt = optimizedPrompt.slice(0, -suffix.length);
                optimizations.push(`Removed unnecessary suffix: "${suffix}"`);
                break;
            }
        }

        // Replace verbose constructs with simpler alternatives
        this.verboseConstructs.forEach((replacement, pattern) => {
            if (pattern.test(optimizedPrompt)) {
                const before = optimizedPrompt;
                optimizedPrompt = optimizedPrompt.replace(pattern, replacement);
                if (before !== optimizedPrompt) {
                    optimizations.push(
                        `Replaced "${pattern.source}" with "${replacement}"`
                    );
                }
            }
        });

        // Remove duplicate spaces and trim
        optimizedPrompt = optimizedPrompt.replace(/\s+/g, " ").trim();
        if (prompt.length !== optimizedPrompt.length) {
            optimizations.push("Removed extra whitespace");
        }

        const optimizedTokenCount = this.countTokens(optimizedPrompt);
        const savings = originalTokenCount - optimizedTokenCount;

        return {
            originalTokenCount,
            optimizedTokenCount,
            optimizedPrompt,
            savings,
            optimizations,
        };
    }

    static async analyzePromptHistory(prompts: string[]): Promise<{
        totalSaved: number;
        averageSavings: number;
        optimizationRate: number;
        recommendations: string[];
    }> {
        const results = prompts.map((prompt) => this.optimize(prompt));
        const totalSaved = results.reduce(
            (sum, result) => sum + result.savings,
            0
        );
        const averageSavings = totalSaved / prompts.length;
        const optimizationRate =
            results.filter((r) => r.savings > 0).length / prompts.length;

        // Analyze patterns in the prompts to generate recommendations
        const recommendations = this.generateRecommendations(prompts, results);

        return {
            totalSaved,
            averageSavings,
            optimizationRate,
            recommendations,
        };
    }

    private static generateRecommendations(
        prompts: string[],
        results: OptimizationResult[]
    ): string[] {
        const recommendations: string[] = [];

        // Check for common patterns that could be optimized
        const verbosePromptsCount = results.filter(
            (r) => r.originalTokenCount > r.optimizedTokenCount * 1.3
        ).length;

        if (verbosePromptsCount > prompts.length * 0.3) {
            recommendations.push(
                "Consider using more concise language in your prompts. Many prompts could be shortened by 30% or more."
            );
        }

        // Check for consistently high token counts
        const avgTokenCount =
            results.reduce((sum, r) => sum + r.originalTokenCount, 0) /
            results.length;

        if (avgTokenCount > 100) {
            recommendations.push(
                "Your prompts are consistently long. Consider breaking complex prompts into smaller, focused interactions."
            );
        }

        return recommendations;
    }

    private static countTokens(text: string): number {
        return encode(text).length;
    }
}
