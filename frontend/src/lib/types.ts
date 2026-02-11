export interface Stats {
    total_requests: number;
    avg_latency_ms: number;
    pii_redacted_count: number;
    risk_score: number;
}

export interface AuditLog {
    id: number;
    request_id: string;
    user_id: string;
    timestamp: string;
    risk_score: number;
    entity_types: string[];
    latency_ms: number;
    status: string;
}

export interface TrendData {
    time: string;
    requests: number;
    latency: number;
}

export interface DistributionData {
    name: string;
    value: number;
}
