"use client";

import { Card, Title, AreaChart, Text } from "@tremor/react";

interface TrendData {
    time: string;
    requests: number;
    latency: number;
}

interface TrafficTrendChartProps {
    data: TrendData[];
}

export default function TrafficTrendChart({ data }: TrafficTrendChartProps) {
    return (
        <Card className="ring-0 border dark:bg-slate-900 shadow-sm rounded-xl">
            <Title className="text-slate-900 dark:text-slate-50 font-bold">Traffic & Latency Trends</Title>
            <Text className="dark:text-slate-400">Request volume vs average processing time (ms)</Text>
            <AreaChart
                className="h-72 mt-4"
                data={data}
                index="time"
                categories={["requests", "latency"]}
                colors={["blue", "rose"]}
                valueFormatter={(number: number) =>
                    Intl.NumberFormat("us").format(number).toString()
                }
                yAxisWidth={40}
                showAnimation={true}
            />
        </Card>
    );
}
