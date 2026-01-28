"use client";

import {
    Card,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Text,
    Badge,
} from "@tremor/react";

interface AuditLog {
    id: number;
    timestamp: string;
    risk_score: number;
    entity_types: string[];
    latency_ms: number;
    status: string;
}

export default function TrafficInspector({ logs }: { logs: AuditLog[] }) {
    return (
        <Card className="mt-8">
            <Text className="text-xl font-bold mb-4">Live Traffic Inspector</Text>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Timestamp</TableHeaderCell>
                        <TableHeaderCell>Risk Score</TableHeaderCell>
                        <TableHeaderCell>Entities Detected</TableHeaderCell>
                        <TableHeaderCell>Latency</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge color={item.risk_score > 0.5 ? "red" : "blue"}>
                                    {item.risk_score.toFixed(2)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {item.entity_types.length > 0 ? (
                                        item.entity_types.map((type) => (
                                            <Badge key={type} size="xs" color="gray">
                                                {type}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Text className="italic text-gray-400">None</Text>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{item.latency_ms}ms</TableCell>
                            <TableCell>
                                <Badge color="emerald">{item.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
