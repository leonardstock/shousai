/* eslint-disable @typescript-eslint/no-explicit-any */
import { CacheConfig, CacheEntry } from "@/models/interfaces/cache";
import { Redis } from "@upstash/redis";
import objectHash from "object-hash";

// Initialize Redis client
const createRedisClient = (connectionString: string) => {
    return new Redis({
        url: connectionString,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
};

// Generate cache key from request content
const generateCacheKey = (
    messages: any[],
    model: string,
    provider: string
): string => {
    const content = messages
        .map((m) => m.content.trim().toLowerCase())
        .join("");
    return `cache:${objectHash({ content, model, provider })}`;
};

// Cache operations
const setCache = async (
    redis: Redis,
    key: string,
    entry: CacheEntry,
    ttl: number
): Promise<void> => {
    const serializedEntry = JSON.stringify(entry);
    try {
        await redis.set(key, serializedEntry, { ex: ttl });
    } catch (error) {
        console.error("Error setting cache:", error);
        throw error;
    }
};

const getCache = async (
    redis: Redis,
    key: string
): Promise<CacheEntry | null> => {
    try {
        const cached = await redis.get(key);
        if (!cached) return null;

        // Handle both string and object responses from Redis
        const cachedString =
            typeof cached === "string" ? cached : JSON.stringify(cached);
        return JSON.parse(cachedString);
    } catch (error) {
        console.error("Error getting cache:", error);
        return null;
    }
};

// Public API functions
export const getCachedResponse = async (
    redis: Redis,
    messages: any[],
    model: string,
    provider: string
): Promise<CacheEntry | null> => {
    const key = generateCacheKey(messages, model, provider);
    return getCache(redis, key);
};

export const cacheResponse = async (
    redis: Redis,
    config: CacheConfig,
    messages: any[],
    model: string,
    provider: string,
    response: any,
    tokenCount: any
): Promise<void> => {
    const key = generateCacheKey(messages, model, provider);
    const entry: CacheEntry = {
        response: JSON.parse(JSON.stringify(response)), // Deep clone to ensure serializability
        tokenCount,
        timestamp: Date.now(),
        model,
        provider,
    };
    await setCache(redis, key, entry, config.ttl);
};

export const getCacheStats = async (
    redis: Redis,
    userId: string
): Promise<any> => {
    const key = `stats:${userId}`;
    try {
        const stats = await redis.get(key);
        if (!stats) return { hits: 0, misses: 0, savings: 0 };

        // Handle both string and object responses
        const statsString =
            typeof stats === "string" ? stats : JSON.stringify(stats);
        return JSON.parse(statsString);
    } catch (error) {
        console.error("Error getting stats:", error);
        return { hits: 0, misses: 0, savings: 0 };
    }
};

export const updateCacheStats = async (
    redis: Redis,
    userId: string,
    hit: boolean,
    savedCost: number = 0
): Promise<void> => {
    const key = `stats:${userId}`;
    try {
        const stats = await getCacheStats(redis, userId);
        const updatedStats = {
            hits: stats.hits + (hit ? 1 : 0),
            misses: stats.misses + (hit ? 0 : 1),
            savings: stats.savings + savedCost,
        };
        await redis.set(key, JSON.stringify(updatedStats));
    } catch (error) {
        console.error("Error updating stats:", error);
        throw error;
    }
};

export const clearUserCache = async (
    redis: Redis,
    userId: string
): Promise<void> => {
    const pattern = `cache:${userId}:*`;
    try {
        const keys: string[] = [];
        let cursor = 0;

        do {
            const [nextCursor, matchingKeys] = await redis.scan(cursor, {
                match: pattern,
                count: 100,
            });
            cursor = parseInt(nextCursor, 10);
            keys.push(...matchingKeys);
        } while (cursor !== 0);

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (error) {
        console.error("Error clearing cache:", error);
        throw error;
    }
};

// Factory function to create cache instance
export const createRequestCache = (
    connectionString: string,
    config: CacheConfig = {
        ttl: 3600,
        similarityThreshold: 0.9,
    }
) => {
    const redis = createRedisClient(connectionString);

    return {
        getCachedResponse: (messages: any[], model: string, provider: string) =>
            getCachedResponse(redis, messages, model, provider),
        cacheResponse: (
            messages: any[],
            model: string,
            provider: string,
            response: any,
            tokenCount: any
        ) =>
            cacheResponse(
                redis,
                config,
                messages,
                model,
                provider,
                response,
                tokenCount
            ),
        getCacheStats: (userId: string) => getCacheStats(redis, userId),
        updateCacheStats: (
            userId: string,
            hit: boolean,
            savedCost: number = 0
        ) => updateCacheStats(redis, userId, hit, savedCost),
        clearUserCache: (userId: string) => clearUserCache(redis, userId),
    };
};
