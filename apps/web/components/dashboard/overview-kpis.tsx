"use client";

import { useState } from "react";
import type { KpiData } from "@/lib/mock/server-metrics";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { MetricDelta } from "@/components/dashboard/metric-delta";

interface OverviewKpisProps {
  kpi: KpiData;
  prevKpi?: KpiData;
  cpuHistory: number[];
  memHistory: number[];
}

function getThresholdColor(value: number, warn: number, crit: number): string {
  if (value >= crit) return "#E5484D";
  if (value >= warn) return "#F5A623";
  return "#3DD68C";
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const width = 80;
  const height = 20;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - 2 - ((v - min) / range) * (height - 4);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      height={height}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1}
        opacity={0.7}
      />
    </svg>
  );
}

interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  color: string;
  description: string;
  progress?: number;
  sparkline?: { values: number[]; color: string };
  delta?: { current: number; previous: number; invertGood?: boolean };
}

function KpiCard({
  label,
  value,
  color,
  description,
  progress,
  sparkline,
  delta,
}: KpiCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="jl-glass jl-gradient-border rounded-md p-3 hover:bg-jl-card/80 transition-all"
      style={{ transform: hovered ? "translateY(-1px)" : undefined }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
          />
          <span className="text-jl-muted text-[10px] font-bold">{label}</span>
        </div>
        {sparkline && (
          <div className="w-[60px] opacity-60">
            <MiniSparkline values={sparkline.values} color={sparkline.color} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1.5">
        <div className="text-2xl font-bold" style={{ color }}>
          {value}
        </div>
        {delta && (
          <MetricDelta
            current={delta.current}
            previous={delta.previous}
            invertGood={delta.invertGood}
          />
        )}
      </div>
      <div className="text-jl-muted text-[9px] mt-1">{description}</div>
      {progress !== undefined && (
        <div className="mt-2 bg-white/5 h-[3px] rounded-sm overflow-hidden">
          <div
            className="h-[3px] rounded-sm transition-all duration-300"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: color,
              boxShadow: `0 0 4px ${color}80`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export function OverviewKpis({
  kpi,
  prevKpi,
  cpuHistory,
  memHistory,
}: OverviewKpisProps) {
  const cpuColor = getThresholdColor(kpi.cpu, 70, 90);
  const memColor = getThresholdColor(kpi.memory, 75, 90);
  const uptimeColor = kpi.uptimeDays > 30 ? "#3AA0FF" : "#3DD68C";
  const updatesColor = kpi.pendingUpdates > 0 ? "#F5A623" : "#3DD68C";

  return (
    <>
      <div className="text-jl-muted text-[11px] font-bold tracking-wide mx-0.5 mb-1.5">
        VISÃO GERAL
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-4">
        <KpiCard
          label="CPU"
          value={
            <AnimatedCounter
              value={kpi.cpu}
              decimals={1}
              suffix="%"
              color={cpuColor}
            />
          }
          color={cpuColor}
          description="Utilização atual"
          progress={kpi.cpu}
          sparkline={{ values: cpuHistory, color: cpuColor }}
          delta={
            prevKpi
              ? { current: kpi.cpu, previous: prevKpi.cpu, invertGood: true }
              : undefined
          }
        />
        <KpiCard
          label="MEMÓRIA"
          value={
            <AnimatedCounter
              value={kpi.memory}
              decimals={1}
              suffix="%"
              color={memColor}
            />
          }
          color={memColor}
          description="Utilização atual"
          progress={kpi.memory}
          sparkline={{ values: memHistory, color: memColor }}
          delta={
            prevKpi
              ? {
                  current: kpi.memory,
                  previous: prevKpi.memory,
                  invertGood: true,
                }
              : undefined
          }
        />
        <KpiCard
          label="UPTIME"
          value={
            <AnimatedCounter
              value={kpi.uptimeDays}
              suffix="d"
              color={uptimeColor}
            />
          }
          color={uptimeColor}
          description="Tempo de atividade"
          progress={Math.min((kpi.uptimeDays / 60) * 100, 100)}
        />
        <KpiCard
          label="UPDATES PENDENTES"
          value={
            <AnimatedCounter value={kpi.pendingUpdates} color={updatesColor} />
          }
          color={updatesColor}
          description="Atualizações do Windows"
          progress={kpi.pendingUpdates > 0 ? 100 : 0}
          delta={
            prevKpi
              ? {
                  current: kpi.pendingUpdates,
                  previous: prevKpi.pendingUpdates,
                  invertGood: true,
                }
              : undefined
          }
        />
        <KpiCard
          label="REINICIALIZAÇÃO"
          value={kpi.rebootPending ? "SIM" : "NÃO"}
          color={kpi.rebootPending ? "#E5484D" : "#3DD68C"}
          description="Pendente?"
          progress={kpi.rebootPending ? 100 : 0}
        />
      </div>
    </>
  );
}
