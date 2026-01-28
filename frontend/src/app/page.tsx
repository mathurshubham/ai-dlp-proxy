"use client";

import { useState, useEffect, useCallback } from "react";
import StatsOverview from "@/components/StatsOverview";
import TrafficInspector from "@/components/TrafficInspector";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Activity, RefreshCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_requests: 0,
    avg_latency_ms: 0,
    pii_redacted_count: 0,
    risk_score: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setIsRefreshing(true);
    setError(null);

    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/stats/overview"),
        fetch("http://localhost:8000/api/v1/stats/recent")
      ]);

      if (!statsRes.ok || !logsRes.ok) {
        throw new Error("One or more services are unreachable.");
      }

      const statsData = await statsRes.json();
      const logsData = await logsRes.json();

      setStats(statsData);
      setLogs(logsData);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError("Unable to connect to the Security Engine. Please ensure the backend is running.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(), 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans antialiased">
      <header className="sticky top-0 z-10 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Sentinel AI</h1>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest leading-none">Privacy Proxy</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 font-semibold">
              <Activity className="h-3 w-3 animate-pulse" />
              Monitoring Active
            </div>
            <button
              onClick={() => fetchData()}
              disabled={isRefreshing}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCcw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-8 space-y-8 max-w-7xl">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed rounded-2xl bg-white dark:bg-slate-900">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mb-4 text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2 font-mono">SEC_CONN_FAIL</h2>
            <p className="max-w-md text-slate-500 dark:text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => fetchData(true)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Re-establish Handshake
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        ) : (
          <div className="transition-all duration-700">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Security Command</h2>
                <p className="text-slate-500 dark:text-slate-400">Observing data flow across private LLM infrastructure.</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Node Identity</p>
                <p className="font-mono text-xs text-slate-600 dark:text-slate-300">SENTINEL-PRIMARY-01</p>
              </div>
            </div>
            <StatsOverview stats={stats} />
            <TrafficInspector logs={logs} />
          </div>
        )}
      </div>

      <footer className="mt-20 border-t py-8 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
        Secure Sentinel AI | Privacy Engine v1.0.0
      </footer>
    </main>
  );
}
