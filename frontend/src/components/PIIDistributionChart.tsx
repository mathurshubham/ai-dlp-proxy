"use client";

import { Card, Title } from "@tremor/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#d946ef", "#f43f5e", "#f59e0b"];

interface PIIValue {
    name: string;
    value: number;
}

interface PIIDistributionChartProps {
    data: PIIValue[];
}

export default function PIIDistributionChart({ data }: PIIDistributionChartProps) {
    const hasData = data.length > 0;

    return (
        <Card className="ring-0 border dark:bg-slate-900 shadow-sm rounded-xl h-full flex flex-col">
            <Title className="text-slate-900 dark:text-slate-50 font-bold">PII Distribution</Title>
            <div className="flex-1 flex flex-col items-center justify-center mt-4">
                {hasData ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1000}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 space-y-2">
                        <div className="w-32 h-32 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                            <span className="text-xs text-slate-400 font-medium italic text-center px-4">No PII segments identified</span>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
