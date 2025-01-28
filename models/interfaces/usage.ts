import { UsageLog } from "@prisma/client";

export interface DailyMetrics {
    total_cost: number;
    cached_cost: number;
    actual_cost: number;
    savings: number;
    savings_percentage: string;
}

export interface RequestMetrics {
    total: number;
    cached: number;
    direct: number;
    cache_hit_rate: string;
}

export interface DailyStat {
    date: string;
    metrics: DailyMetrics;
    requests: RequestMetrics;
}

export interface AnalyticsSummary {
    date_range: {
        start: string;
        end: string;
    };
    total_days: number;
    total_cost: number;
    total_savings: number;
    actual_cost: number;
    average_cache_hit_rate: string;
    total_requests: number;
    cached_requests: number;
    direct_requests: number;
}

export interface UsageResponse {
    logs: UsageLog[];
    analytics: {
        daily: DailyStat[];
        summary: AnalyticsSummary;
    };
}
