"use client";

import { useState } from "react";
import type { AlertEvent } from "@/lib/mock/server-metrics";

interface NotificationBellProps {
  alerts: AlertEvent[];
}

const SEVERITY_DOT: Record<string, string> = {
  critical: "#E5484D",
  warning: "#F5A623",
  info: "#3AA0FF",
};

export function NotificationBell({ alerts }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const totalUnread = alerts.length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-8 h-8 rounded-md bg-jl-card border border-jl-border hover:border-jl-teal transition-colors"
        title="Notificações"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-jl-muted"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {totalUnread > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold rounded-full px-1"
            style={{
              backgroundColor: criticalCount > 0 ? "#E5484D" : "#F5A623",
              color: "#0B1015",
              boxShadow: "0 0 4px currentColor",
            }}
          >
            {totalUnread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            role="button"
            tabIndex={-1}
            aria-label="Fechar notificações"
          />
          <div className="fixed left-2 right-2 top-14 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:w-80 bg-jl-bg border border-jl-border rounded-lg shadow-2xl z-50 overflow-hidden mt-1">
            <div className="flex items-center justify-between px-3 py-2 border-b border-jl-border">
              <span className="text-[11px] font-bold text-jl-text">
                Notificações
              </span>
              <span className="text-[9px] text-jl-muted">
                {criticalCount} crítico · {warningCount} aviso
              </span>
            </div>

            <div className="max-h-[280px] overflow-y-auto jl-scroll">
              {alerts.length === 0 ? (
                <div className="px-3 py-6 text-center text-[11px] text-jl-muted">
                  Nenhuma notificação
                </div>
              ) : (
                alerts
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime(),
                  )
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="flex gap-2 px-3 py-2 border-b border-jl-border/50 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{
                          backgroundColor: SEVERITY_DOT[alert.severity],
                          boxShadow: `0 0 4px ${SEVERITY_DOT[alert.severity]}`,
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium text-jl-text truncate">
                          {alert.title}
                        </div>
                        <div className="text-[9px] text-jl-muted truncate">
                          {alert.description}
                        </div>
                        <div className="text-[8px] text-jl-muted/50 mt-0.5">
                          {alert.source}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="px-3 py-2 border-t border-jl-border">
              <button className="text-[10px] text-jl-teal hover:underline">
                Marcar todas como lidas
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
