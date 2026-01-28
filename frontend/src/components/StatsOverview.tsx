"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

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
            metric: stats.total_requests.toLocaleString(),
            icon: ShieldCheck,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            title: "PII Redacted",
            metric: stats.pii_redacted_count.toLocaleString(),
            icon: Users,
            color: "text-red-500",
            bg: "bg-red-50",
        },
        {
            title: "Avg Latency",
            metric: `${Math.round(stats.avg_latency_ms)}ms`,
            icon: Clock,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
        {
            title: "DLP Risk Score",
            metric: stats.risk_score.toFixed(2),
            icon: Lock,
            color: "text-orange-500",
            bg: "bg-orange-50",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((item) => (
                <Card key={item.title} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <div className={cn("p-2 rounded-lg", item.bg)}>
                            <item.icon className={cn("h-4 w-4", item.color)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.metric}</div>
                        <p className="text-xs text-muted-foreground mt-1">Live monitoring active</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
