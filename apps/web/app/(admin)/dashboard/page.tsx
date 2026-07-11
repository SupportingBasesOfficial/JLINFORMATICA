"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { HealthScore } from "@/components/dashboard/health-score";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { OverviewKpis } from "@/components/dashboard/overview-kpis";
import { PerformanceGauges } from "@/components/dashboard/performance-gauges";
import { NetworkMetrics } from "@/components/dashboard/network-metrics";
import { DiskMetrics } from "@/components/dashboard/disk-metrics";
import { DiskTreemap } from "@/components/dashboard/disk-treemap";
import { ServicesPanel } from "@/components/dashboard/services-panel";
import { ProcessTable } from "@/components/dashboard/process-table";
import { AlertsTimeline } from "@/components/dashboard/alerts-timeline";
import {
  getServerMetrics,
  applyVariation,
  calculateHealthScore,
} from "@/lib/mock/server-metrics";
import type { ServerMetrics } from "@/lib/mock/server-metrics";

const SKELETON_DELAY_MS = 600;

interface ToastMessage {
  title: string;
  description: string;
  severity: "critical" | "warning";
}

export default function DashboardPage() {
  const [selectedServer, setSelectedServer] = useState("srv-web01");
  const [selectedTime, setSelectedTime] = useState("24h");
  const [refreshInterval, setRefreshInterval] = useState(3000);
  const [metrics, setMetrics] = useState<ServerMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedServer, setLoadedServer] = useState(selectedServer);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prevMetrics, setPrevMetrics] = useState<ServerMetrics | null>(null);
  const metricsRef = useRef<ServerMetrics | null>(null);

  // Carrega metricas iniciais quando troca servidor
  useEffect(() => {
    const timer = setTimeout(() => {
      const fresh = getServerMetrics(selectedServer);
      metricsRef.current = fresh;
      setMetrics(fresh);
      setPrevMetrics(null);
      setLastUpdate(new Date());
      setSecondsAgo(0);
      setIsLoading(false);
      setLoadedServer(selectedServer);
    }, SKELETON_DELAY_MS);

    return () => clearTimeout(timer);
  }, [selectedServer]);

  // Verifica cruzamento de threshold e dispara toast
  const checkThresholds = useCallback(
    (prev: ServerMetrics, next: ServerMetrics) => {
      const toasts: ToastMessage[] = [];

      if (prev.cpuGauge.current < 90 && next.cpuGauge.current >= 90) {
        toasts.push({
          title: "CPU Crítico",
          description: `CPU atingiu ${next.cpuGauge.current.toFixed(1)}% em ${next.server.name}`,
          severity: "critical",
        });
      }
      if (prev.memGauge.current < 90 && next.memGauge.current >= 90) {
        toasts.push({
          title: "Memória Crítica",
          description: `Memória atingiu ${next.memGauge.current.toFixed(1)}% em ${next.server.name}`,
          severity: "critical",
        });
      }
      if (prev.cpuGauge.current < 70 && next.cpuGauge.current >= 70) {
        toasts.push({
          title: "CPU Elevada",
          description: `CPU acima de 70%: ${next.cpuGauge.current.toFixed(1)}%`,
          severity: "warning",
        });
      }

      toasts.forEach((t) => {
        if (t.severity === "critical") {
          toast.error(t.title, { description: t.description });
        } else {
          toast.warning(t.title, { description: t.description });
        }
      });
    },
    [],
  );

  // Auto-refresh com intervalo configuravel
  useEffect(() => {
    if (!metricsRef.current || isPaused) return;

    const interval = setInterval(() => {
      setIsRefreshing(true);
      const prev = metricsRef.current!;
      const varied = applyVariation(prev);
      metricsRef.current = varied;
      setPrevMetrics(prev);
      setMetrics(varied);
      setLastUpdate(new Date());
      setSecondsAgo(0);
      setIsRefreshing(false);
      checkThresholds(prev, varied);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [selectedServer, refreshInterval, isPaused, checkThresholds]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      if (e.key === "r" || e.key === "R") {
        setIsPaused((p) => {
          toast.info(p ? "Auto-retomado" : "Auto-refresh pausado");
          return !p;
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Countdown "há Xs"
  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdate.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastUpdate]);

  const showSkeleton = isLoading || loadedServer !== selectedServer || !metrics;
  if (showSkeleton) {
    return <DashboardSkeleton />;
  }

  const healthScore = calculateHealthScore(metrics);

  return (
    <div className="bg-jl-bg rounded-xl p-4">
      <h2 className="sr-only">
        Dashboard executivo Windows Server — visão geral, desempenho, rede,
        disco, serviços, alertas e processos
      </h2>

      <div className="flex flex-col md:flex-row md:items-start gap-2 mb-3">
        <div className="flex-1">
          <DashboardHeader
            selectedServer={selectedServer}
            selectedTime={selectedTime}
            refreshInterval={refreshInterval}
            onServerChange={setSelectedServer}
            onTimeChange={setSelectedTime}
            onRefreshIntervalChange={setRefreshInterval}
          />
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell alerts={metrics.alerts} />
          <HealthScore score={healthScore} />
        </div>
      </div>

      <OverviewKpis
        kpi={metrics.kpi}
        prevKpi={prevMetrics?.kpi}
        cpuHistory={metrics.cpuQueue}
        memHistory={
          metrics.memGauge.avg1
            ? [
                metrics.memGauge.avg15,
                metrics.memGauge.avg5,
                metrics.memGauge.avg1,
                metrics.memGauge.current,
              ]
            : []
        }
      />

      <PerformanceGauges
        cpuGauge={metrics.cpuGauge}
        memGauge={metrics.memGauge}
        cpuQueue={metrics.cpuQueue}
      />

      <NetworkMetrics
        network={metrics.network}
        summary={metrics.networkSummary}
      />

      <DiskMetrics
        drives={metrics.diskDrives}
        iops={metrics.diskIops}
        latency={metrics.diskLatency}
        queue={metrics.diskQueue}
        latencySummary={metrics.diskLatencySummary}
        queueSummary={metrics.diskQueueSummary}
      />

      <DiskTreemap data={metrics.treemap} />

      <AlertsTimeline alerts={metrics.alerts} />

      <ServicesPanel services={metrics.services} />

      <ProcessTable processes={metrics.processes} />

      {/* Footer com indicador de auto-refresh */}
      <div className="mt-4 flex items-center justify-between text-[9px] text-jl-muted border-t border-jl-border pt-2.5">
        <span className="flex items-center gap-1.5">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${isPaused ? "bg-jl-amber" : isRefreshing ? "bg-jl-teal" : "bg-jl-green"}`}
            style={{
              boxShadow: "0 0 4px currentColor",
              animation: isPaused ? "none" : "jlblink 2s infinite",
            }}
          />
          {isPaused ? (
            <span className="text-jl-amber font-bold">Pausado</span>
          ) : (
            <>Auto-refresh a cada {refreshInterval / 1000}s</>
          )}
          <span className="ml-2 text-jl-muted/40">
            [R] para {isPaused ? "retomar" : "pausar"}
          </span>
        </span>
        <span>
          Última atualização há <b className="text-jl-text">{secondsAgo}s</b>
        </span>
      </div>
    </div>
  );
}
