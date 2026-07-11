"use client";

import { servers, timeWindows } from "@/lib/mock/server-metrics";

interface DashboardHeaderProps {
  selectedServer: string;
  selectedTime: string;
  refreshInterval: number;
  onServerChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onRefreshIntervalChange: (value: number) => void;
}

const STATUS_COLORS: Record<string, string> = {
  online: "#3DD68C",
  offline: "#E5484D",
  maintenance: "#F5A623",
};

const STATUS_LABELS: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  maintenance: "Manutenção",
};

const REFRESH_OPTIONS = [
  { value: 1000, label: "1s" },
  { value: 3000, label: "3s" },
  { value: 5000, label: "5s" },
  { value: 10000, label: "10s" },
];

export function DashboardHeader({
  selectedServer,
  selectedTime,
  refreshInterval,
  onServerChange,
  onTimeChange,
  onRefreshIntervalChange,
}: DashboardHeaderProps) {
  const server = servers.find((s) => s.id === selectedServer);

  return (
    <div className="mb-4">
      {/* Title + filters row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="text-sm font-medium text-jl-text">
          Painel Executivo — Infraestrutura Windows Server
        </div>
        <div className="flex gap-2 text-[11px]">
          <select
            value={selectedServer}
            onChange={(e) => onServerChange(e.target.value)}
            className="bg-jl-card text-jl-muted px-2.5 py-1 rounded border border-jl-border cursor-pointer outline-none hover:border-jl-teal transition-colors"
          >
            {servers.map((s) => (
              <option key={s.id} value={s.id}>
                Servidor: {s.name}
              </option>
            ))}
          </select>
          <select
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="bg-jl-card text-jl-muted px-2.5 py-1 rounded border border-jl-border cursor-pointer outline-none hover:border-jl-teal transition-colors"
          >
            {timeWindows.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            value={refreshInterval}
            onChange={(e) => onRefreshIntervalChange(Number(e.target.value))}
            className="bg-jl-card text-jl-muted px-2.5 py-1 rounded border border-jl-border cursor-pointer outline-none hover:border-jl-teal transition-colors"
            title="Intervalo de auto-refresh"
          >
            {REFRESH_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                Refresh: {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Server info bar */}
      {server && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 bg-jl-card rounded-md px-3.5 py-2 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                backgroundColor: STATUS_COLORS[server.status],
                boxShadow: `0 0 6px ${STATUS_COLORS[server.status]}`,
              }}
            />
            <span className="text-jl-muted">Status:</span>
            <span
              className="font-bold"
              style={{ color: STATUS_COLORS[server.status] }}
            >
              {STATUS_LABELS[server.status]}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-jl-muted">Hostname:</span>
            <span className="text-jl-text">{server.hostname}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-jl-muted">IP:</span>
            <span className="text-jl-text">{server.ip}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-jl-muted">OS:</span>
            <span className="text-jl-text">{server.os}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-jl-muted">Grupo:</span>
            <span className="text-jl-text">{server.groupName}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-jl-muted">Last Boot:</span>
            <span className="text-jl-text">
              {new Date(server.lastBoot).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
