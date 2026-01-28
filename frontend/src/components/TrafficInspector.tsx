"use client";

import { useState } from "react";
import LogDetailSheet from "./LogDetailSheet";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AuditLog {
    id: number;
    request_id: string;
    user_id: string;
    timestamp: string;
    risk_score: number;
    entity_types: string[];
    latency_ms: number;
    status: string;
}

export default function TrafficInspector({ logs }: { logs: AuditLog[] }) {
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleRowClick = (log: AuditLog) => {
        setSelectedLog(log);
        setIsSheetOpen(true);
    };

    return (
        <>
            <Card className="col-span-4 mt-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                        <CardTitle>Live Traffic Inspector</CardTitle>
                        <CardDescription>
                            Real-time monitoring of PII detection and redaction events
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <div className="flex h-[200px] flex-col items-center justify-center space-y-2 border-2 border-dashed rounded-lg bg-slate-50/50">
                            <p className="text-sm text-muted-foreground">No traffic detected yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Timestamp</TableHead>
                                    <TableHead>Risk</TableHead>
                                    <TableHead>Entities Detected</TableHead>
                                    <TableHead className="text-right">Latency</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="group transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <TableCell className="font-medium text-slate-600">
                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={item.risk_score > 0.5 ? "destructive" : "secondary"}>
                                                {item.risk_score.toFixed(2)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {item.entity_types.length > 0 ? (
                                                    item.entity_types.map((type) => (
                                                        <Badge key={type} variant="outline" className="text-[10px] uppercase font-bold text-slate-500">
                                                            {type}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs italic text-slate-400">None</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-slate-500 font-mono text-xs">
                                            {item.latency_ms}ms
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center">
                                                <div className={`h-2 w-2 rounded-full ${item.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse mr-2`} />
                                                <span className={`text-xs font-semibold ${item.status === 'SUCCESS' ? 'text-emerald-700' : 'text-rose-700'}`}>{item.status}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <LogDetailSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                log={selectedLog}
            />
        </>
    );
}
