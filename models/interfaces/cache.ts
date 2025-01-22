/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CacheConfig {
    ttl: number; // Time to live in seconds
    similarityThreshold: number; // Threshold for fuzzy matching
}

export interface CacheEntry {
    response: any;
    tokenCount: any;
    timestamp: number;
    model: string;
    provider: string;
}
