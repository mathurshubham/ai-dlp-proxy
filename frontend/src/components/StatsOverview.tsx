"use client";

import { Card, Metric, Text, Flex, BadgeDelta, Grid } from "@tremor/react";

interface Stats {
    total_requests: number;
    avg_latency_ms: number;
    pii_redacted_count: number;
    risk_score: number;
}

export default function StatsOverview({ stats }: { stats: Stats }) {
    const categories = [
        {
            title: "Total Requests",
            metric: stats.total_requests.toString(),
            icon: "ShieldCheckIcon",
            color: "blue",
        },
        {
            title: "PII Redacted",
            metric: stats.pii_redacted_count.toString(),
            icon: "UserGroupIcon",
            color: "red",
        },
        {
            title: "Avg Latency",
            metric: `${stats.avg_latency_ms}ms`,
            icon: "ClockIcon",
            color: "emerald",
        },
        {
            title: "DLP Risk Score",
            metric: stats.risk_score.toString(),
            icon: "LockClosedIcon",
            color: "orange",
        },
    ];

    return (
        <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
            {categories.map((item) => (
                <Card key={item.title} decoration="top" decorationColor={item.color as any}>
                    <Text>{item.title}</Text>
                    <Metric>{item.metric}</Metric>
                </Card>
            ))}
        </Grid>
    );
}
