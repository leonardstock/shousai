import { CacheEntry } from "@/models/interfaces/cache";
import { createRequestCache } from "../lib/cache/requestCache";
import dotenv from "dotenv";

dotenv.config();

interface BenchmarkConfig {
    totalRequests: number;
    uniqueRequestPercentage: number;
    modelPricing: {
        [key: string]: number; // price per 1K tokens
    };
    scenarios: {
        [key: string]: number; // percentage of requests for each scenario
    };
}

interface BenchmarkResult {
    totalRequests: number;
    cacheHits: number;
    cacheMisses: number;
    hitRate: number;
    costWithoutCache: number;
    costWithCache: number;
    totalSavings: number;
    savingsPercentage: number;
    averageResponseTime: number;
    scenarioBreakdown: {
        [key: string]: {
            requests: number;
            hitRate: number;
            savings: number;
        };
    };
}

const selectScenarioType = (scenarios: { [key: string]: number }): string => {
    const rand = Math.random() * 100;
    let cumulative = 0;
    for (const [scenario, percentage] of Object.entries(scenarios)) {
        cumulative += percentage;
        if (rand <= cumulative) return scenario;
    }
    return Object.keys(scenarios)[0];
};

const generateUniqueRequest = (
    scenarioType: string
): Array<{ content: string }> => {
    const templates = {
        dataEnrichment: () => ({
            company: `Company${Math.random().toString(36).substring(7)}`,
            industry: ["Tech", "Finance", "Healthcare", "Manufacturing"][
                Math.floor(Math.random() * 4)
            ],
            revenue: ["10M-50M", "50M-100M", "100M-500M"][
                Math.floor(Math.random() * 3)
            ],
        }),
        marketAnalysis: () => ({
            competitor: `Competitor${Math.random().toString(36).substring(7)}`,
            sector: ["AI/ML", "Cloud Infrastructure", "Security"][
                Math.floor(Math.random() * 3)
            ],
            region: ["NA", "EMEA", "APAC"][Math.floor(Math.random() * 3)],
        }),
        documentProcessing: () => ({
            document_id: `DOC-${Date.now()}`,
            type: ["Contract", "Invoice", "Report"][
                Math.floor(Math.random() * 3)
            ],
            client: `Client${Math.random().toString(36).substring(7)}`,
        }),
        customerSupport: () => ({
            ticket_id: `TICKET-${Date.now()}`,
            severity: ["P1", "P2", "P3"][Math.floor(Math.random() * 3)],
            component: ["API", "Dashboard", "Integration"][
                Math.floor(Math.random() * 3)
            ],
        }),
    };

    const generator = templates[scenarioType as keyof typeof templates];
    return [{ content: JSON.stringify(generator(), null, 2) }];
};

const sampleScenarios = {
    dataEnrichment: [
        {
            content: JSON.stringify(
                {
                    request_type: "customer_enrichment",
                    data: {
                        company: "Acme Corp",
                        industry: "Manufacturing",
                        revenue: "50M-100M",
                        employees: "100-500",
                    },
                },
                null,
                2
            ),
        },
        {
            content: JSON.stringify(
                {
                    request_type: "lead_enrichment",
                    data: {
                        company: "TechStart Inc",
                        website: "techstart.io",
                        contact: "Sarah Smith, CTO",
                    },
                },
                null,
                2
            ),
        },
    ],
    marketAnalysis: [
        {
            content: JSON.stringify(
                {
                    request_type: "competitor_analysis",
                    data: {
                        competitor: "InnovateCorp",
                        product: "AI Platform",
                        target_market: "Enterprise",
                        key_features: [
                            "ML Pipeline",
                            "AutoML",
                            "Model Monitoring",
                        ],
                    },
                },
                null,
                2
            ),
        },
    ],
    documentProcessing: [
        {
            content: JSON.stringify(
                {
                    request_type: "contract_analysis",
                    data: {
                        document_type: "Service Agreement",
                        parties: ["CloudTech Solutions", "Enterprise Client"],
                        effective_date: "2024-01-15",
                    },
                },
                null,
                2
            ),
        },
    ],
    customerSupport: [
        {
            content: JSON.stringify(
                {
                    request_type: "technical_support",
                    data: {
                        category: "API Integration",
                        priority: "High",
                        description:
                            "OAuth token refresh failure in production environment",
                        client_type: "Enterprise",
                    },
                },
                null,
                2
            ),
        },
    ],
};

const generateRequest = (
    scenarios: { [key: string]: number },
    uniquePercentage: number
) => {
    if (Math.random() * 100 < uniquePercentage) {
        const scenarioType = selectScenarioType(scenarios);
        return generateUniqueRequest(scenarioType);
    }

    const scenarioType = selectScenarioType(scenarios);
    const scenarioRequests =
        sampleScenarios[scenarioType as keyof typeof sampleScenarios];
    return [
        scenarioRequests[Math.floor(Math.random() * scenarioRequests.length)],
    ];
};

const determineScenarioType = (content: string): string => {
    try {
        const parsed = JSON.parse(content);
        if (parsed.request_type?.includes("enrichment"))
            return "dataEnrichment";
        if (parsed.request_type?.includes("analysis")) return "marketAnalysis";
        if (parsed.request_type?.includes("contract"))
            return "documentProcessing";
        return "customerSupport";
    } catch {
        // Fallback if JSON parsing fails
        if (content.includes("company") || content.includes("industry"))
            return "dataEnrichment";
        if (content.includes("competitor") || content.includes("market"))
            return "marketAnalysis";
        if (content.includes("document") || content.includes("contract"))
            return "documentProcessing";
        return "customerSupport";
    }
};

async function runBenchmark(config: BenchmarkConfig): Promise<BenchmarkResult> {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
        throw new Error(
            "UPSTASH_REDIS_REST_URL environment variable is required"
        );
    }

    const cache = createRequestCache(process.env.UPSTASH_REDIS_REST_URL);

    let hits = 0;
    let misses = 0;
    let totalCostWithoutCache = 0;
    let totalCostWithCache = 0;
    let totalResponseTime = 0;

    const scenarioStats: {
        [key: string]: { hits: number; requests: number; savings: number };
    } = {};

    // Initialize scenario stats
    Object.keys(config.scenarios).forEach((scenario) => {
        scenarioStats[scenario] = { hits: 0, requests: 0, savings: 0 };
    });

    for (let i = 0; i < config.totalRequests; i++) {
        try {
            const messages = generateRequest(
                config.scenarios,
                config.uniqueRequestPercentage
            );
            const model = Math.random() > 0.3 ? "gpt-3.5-turbo" : "gpt-4";
            const provider = "openai";

            const scenarioType = determineScenarioType(messages[0].content);
            scenarioStats[scenarioType].requests++;

            const start = Date.now();

            // Add timeout to cache operations
            const cached = await Promise.race<CacheEntry | null>([
                cache.getCachedResponse(messages, model, provider),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Cache read timeout")),
                        5000
                    )
                ),
            ]).catch((error) => {
                console.error("Cache read error:", error);
                return null;
            });

            if (cached) {
                hits++;
                scenarioStats[scenarioType].hits++;
                const tokenCount = cached.tokenCount;
                const cost = (tokenCount / 1000) * config.modelPricing[model];
                totalCostWithoutCache += cost;
                scenarioStats[scenarioType].savings += cost;
            } else {
                misses++;
                const simulatedTokenCount =
                    Math.floor(Math.random() * 2000) + 1000;
                const cost =
                    (simulatedTokenCount / 1000) * config.modelPricing[model];
                totalCostWithoutCache += cost;
                totalCostWithCache += cost;

                // Simulate API delay
                await new Promise((resolve) =>
                    setTimeout(resolve, 100 + Math.random() * 200)
                );

                const simulatedResponse = {
                    content: JSON.stringify({
                        type: "response",
                        data: {
                            analysis: "Simulated analysis result",
                            confidence: Math.random(),
                            timestamp: new Date().toISOString(),
                        },
                    }),
                };

                // Add timeout to cache write operation
                await Promise.race([
                    cache.cacheResponse(
                        messages,
                        model,
                        provider,
                        simulatedResponse,
                        simulatedTokenCount
                    ),
                    new Promise((_, reject) =>
                        setTimeout(
                            () => reject(new Error("Cache write timeout")),
                            5000
                        )
                    ),
                ]).catch((error) => {
                    console.error("Cache write error:", error);
                });
            }

            totalResponseTime += Date.now() - start;

            // Add progress logging
            if ((i + 1) % 100 === 0) {
                console.log(
                    `Processed ${i + 1}/${config.totalRequests} requests`
                );
                console.log(
                    `Current hit rate: ${((hits / (i + 1)) * 100).toFixed(1)}%`
                );
            }
        } catch (error) {
            console.error(`Error processing request ${i + 1}:`, error);
            misses++; // Count errors as cache misses
            continue; // Continue with next request
        }
    }

    return {
        totalRequests: config.totalRequests,
        cacheHits: hits,
        cacheMisses: misses,
        hitRate: (hits / config.totalRequests) * 100,
        costWithoutCache: totalCostWithoutCache,
        costWithCache: totalCostWithCache,
        totalSavings: totalCostWithoutCache - totalCostWithCache,
        savingsPercentage:
            ((totalCostWithoutCache - totalCostWithCache) /
                totalCostWithoutCache) *
            100,
        averageResponseTime: totalResponseTime / config.totalRequests,
        scenarioBreakdown: Object.entries(scenarioStats).reduce(
            (acc, [scenario, stats]) => ({
                ...acc,
                [scenario]: {
                    requests: stats.requests,
                    hitRate: (stats.hits / stats.requests) * 100,
                    savings: stats.savings,
                },
            }),
            {}
        ),
    };
}

async function main() {
    try {
        const config: BenchmarkConfig = {
            totalRequests: 1000,
            uniqueRequestPercentage: 40,
            modelPricing: {
                "gpt-3.5-turbo": 0.002,
                "gpt-4": 0.03,
            },
            scenarios: {
                dataEnrichment: 30,
                marketAnalysis: 25,
                documentProcessing: 25,
                customerSupport: 20,
            },
        };

        console.log("Running B2B API usage benchmark...");
        const result = await runBenchmark(config);

        console.log("\nBenchmark Results:");
        console.log("==================");
        console.log(`Total Requests: ${result.totalRequests}`);
        console.log(`Cache Hit Rate: ${result.hitRate.toFixed(1)}%`);
        console.log(
            `Cost Without Cache: $${result.costWithoutCache.toFixed(2)}`
        );
        console.log(`Cost With Cache: $${result.costWithCache.toFixed(2)}`);
        console.log(`Total Savings: $${result.totalSavings.toFixed(2)}`);
        console.log(
            `Savings Percentage: ${result.savingsPercentage.toFixed(1)}%`
        );
        console.log(
            `Average Response Time: ${result.averageResponseTime.toFixed(1)}ms`
        );

        console.log("\nScenario Breakdown:");
        console.log("===================");
        Object.entries(result.scenarioBreakdown).forEach(
            ([scenario, stats]) => {
                console.log(`\n${scenario}:`);
                console.log(`  Requests: ${stats.requests}`);
                console.log(`  Hit Rate: ${stats.hitRate.toFixed(1)}%`);
                console.log(`  Savings: $${stats.savings.toFixed(2)}`);
            }
        );
    } catch (error) {
        console.error("Benchmark failed:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}
