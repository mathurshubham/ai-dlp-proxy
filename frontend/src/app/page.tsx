"use client";

import { useState, useEffect } from "react";
import StatsOverview from "@/components/StatsOverview";
import TrafficInspector from "@/components/TrafficInspector";
import { Title, Subtitle, Divider, Flex } from "@tremor/react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_requests: 0,
    avg_latency_ms: 0,
    pii_redacted_count: 0,
    risk_score: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const statsRes = await fetch("http://localhost:8000/api/v1/stats/overview");
      const logsRes = await fetch("http://localhost:8000/api/v1/stats/recent");

      const statsData = await statsRes.json();
      const logsData = await logsRes.json();

      setStats(statsData);
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Flex className="mb-4">
          <div>
            <Title className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sentinel AI Privacy Proxy
            </Title>
            <Subtitle>Security Observability & Data Loss Prevention</Subtitle>
          </div>
        </Flex>

        <Divider />

        {loading ? (
          <div className="flex items-center justify-center p-20 text-gray-400">
            Initializing secure monitor...
          </div>
        ) : (
          <>
            <StatsOverview stats={stats} />
            <TrafficInspector logs={logs} />
          </>
        )}
      </div>
    </main>
  );
}
