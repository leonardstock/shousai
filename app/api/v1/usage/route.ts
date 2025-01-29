import { prisma } from "@/lib/db/prisma";
import { DailyStat, UsageResponse } from "@/models/interfaces/usage";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { differenceInHours } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const start = searchParams.get("start");
        const end = searchParams.get("end");
        const provider = searchParams.get("provider");
        const model = searchParams.get("model");

        if (!start || !end) {
            return new NextResponse("Missing date range", { status: 400 });
        }

        // Validate dates
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return new NextResponse("Invalid date format", { status: 400 });
        }

        const hoursDifference = differenceInHours(endDate, startDate);

        // Determine grouping interval
        const groupByHours = hoursDifference <= 24;

        type DailyCostRow = {
            date: Date;
            total_cost: string;
            cached_cost: string;
            actual_cost: string;
            total_requests: string;
            cached_requests: string;
            direct_requests: string;
        };

        const providerAddon =
            provider === "all"
                ? Prisma.empty
                : Prisma.sql`AND "provider" = ${provider}`;
        const modelAddon =
            model === "all" ? Prisma.empty : Prisma.sql`AND "model" = ${model}`;
        const groupByStatement = groupByHours
            ? Prisma.sql`DATE_TRUNC('hour', "createdAt")`
            : Prisma.sql`DATE_TRUNC('day', "createdAt")`;

        console.log(groupByHours);

        // Get daily costs with cache status within date range
        const dailyCosts = await prisma.$queryRaw<DailyCostRow[]>`
            SELECT 
                ${groupByStatement} as date,
                COALESCE(SUM("cost"), 0) as total_cost,
                COALESCE(SUM(CASE WHEN "cached" = true THEN "cost" ELSE 0 END), 0) as cached_cost,
                COALESCE(SUM(CASE WHEN "cached" = false THEN "cost" ELSE 0 END), 0) as actual_cost,
                COUNT(*) as total_requests,
                COUNT(CASE WHEN "cached" = true THEN 1 END) as cached_requests,
                COUNT(CASE WHEN "cached" = false THEN 1 END) as direct_requests
            FROM "UsageLog"
            WHERE 
                "userId" = ${userId}
                AND "createdAt" >= ${startDate}
                AND "createdAt" <= ${endDate}
                ${providerAddon}
                ${modelAddon}
            GROUP BY ${groupByStatement}
            ORDER BY date ASC
        `;

        // Transform the raw data into a more friendly format
        const formattedStats: DailyStat[] = dailyCosts.map((day) => ({
            date: day.date.toISOString().split(".")[0] + "Z",
            metrics: {
                total_cost: parseFloat(day.total_cost),
                cached_cost: parseFloat(day.cached_cost),
                actual_cost: parseFloat(day.actual_cost),
                savings: parseFloat(day.cached_cost),
                savings_percentage:
                    parseFloat(day.total_cost) > 0
                        ? (
                              (parseFloat(day.cached_cost) /
                                  parseFloat(day.total_cost)) *
                              100
                          ).toFixed(2)
                        : "0.00",
            },
            requests: {
                total: parseInt(day.total_requests),
                cached: parseInt(day.cached_requests),
                direct: parseInt(day.direct_requests),
                cache_hit_rate:
                    parseInt(day.total_requests) > 0
                        ? (
                              (parseInt(day.cached_requests) /
                                  parseInt(day.total_requests)) *
                              100
                          ).toFixed(2)
                        : "0.00",
            },
        }));

        const rawLogs = await prisma.usageLog.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        const response: UsageResponse = {
            logs: rawLogs,
            analytics: {
                daily: formattedStats,
                summary: {
                    date_range: {
                        start,
                        end,
                    },
                    total_days: formattedStats.length,
                    total_cost: formattedStats.reduce(
                        (acc, day) => acc + day.metrics.total_cost,
                        0
                    ),
                    total_savings: formattedStats.reduce(
                        (acc, day) => acc + day.metrics.savings,
                        0
                    ),
                    actual_cost: formattedStats.reduce(
                        (acc, day) => acc + day.metrics.actual_cost,
                        0
                    ),
                    average_cache_hit_rate:
                        formattedStats.length > 0
                            ? (
                                  formattedStats.reduce(
                                      (acc, day) =>
                                          acc +
                                          parseFloat(
                                              day.requests.cache_hit_rate
                                          ),
                                      0
                                  ) / formattedStats.length
                              ).toFixed(2)
                            : "0.00",
                    total_requests: formattedStats.reduce(
                        (acc, day) => acc + day.requests.total,
                        0
                    ),
                    cached_requests: formattedStats.reduce(
                        (acc, day) => acc + day.requests.cached,
                        0
                    ),
                    direct_requests: formattedStats.reduce(
                        (acc, day) => acc + day.requests.direct,
                        0
                    ),
                },
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(
            "Error fetching usage stats:",
            error instanceof Error ? error.message : "Unknown error"
        );
        return new NextResponse("Error fetching usage statistics", {
            status: 500,
        });
    }
}
