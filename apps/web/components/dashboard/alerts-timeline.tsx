import type { AlertEvent, AlertSeverity } from "@/lib/mock/server-metrics";

interface AlertsTimelineProps {
  alerts: AlertEvent[];
}

const SEVERITY_STYLES: Record<
  AlertSeverity,
  { color: string; bg: string; label: string; icon: string }
> = {
  critical: {
    color: "#E5484D",
    bg: "rgba(229,72,77,0.08)",
    label: "CRÍTICO",
    icon: "●",
  },
  warning: {
    color: "#F5A623",
    bg: "rgba(245,166,35,0.08)",
    label: "AVISO",
    icon: "▲",
  },
  info: {
    color: "#3AA0FF",
    bg: "rgba(58,160,255,0.08)",
    label: "INFO",
    icon: "ℹ",
  },
};

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  if (diffMin < 1) return "agora mesmo";
  if (diffMin < 60) return `há ${diffMin}min`;
  if (diffH < 24) return `há ${diffH}h`;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AlertsTimeline({ alerts }: AlertsTimelineProps) {
  const sorted = [...alerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  return (
    <>
      <div className="flex items-center justify-between mx-0.5 mb-2.5 gap-2">
        <span className="text-jl-muted text-[11px] font-bold tracking-wide">
          TIMELINE DE ALERTAS
        </span>
        <div className="flex gap-2.5 text-[9px] flex-shrink-0">
          {criticalCount > 0 && (
            <span className="text-jl-red font-bold">
              {criticalCount} crítico{criticalCount > 1 ? "s" : ""}
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-jl-amber font-bold">
              {warningCount} aviso{warningCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
      <div className="bg-jl-card rounded-md p-3 px-3.5 border border-transparent hover:border-jl-border transition-colors mb-4">
        <div className="max-h-[200px] overflow-y-auto jl-scroll">
          <div className="relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-jl-border" />

            {sorted.map((alert) => {
              const style = SEVERITY_STYLES[alert.severity];
              return (
                <div
                  key={alert.id}
                  className="relative pl-6 pb-3 last:pb-0 hover:bg-white/[0.02] rounded-sm transition-colors -ml-1 pr-2"
                >
                  <span
                    className="absolute left-[3px] top-1 w-[9px] h-[9px] rounded-full border-2 border-jl-bg"
                    style={{
                      backgroundColor: style.color,
                      boxShadow:
                        alert.severity === "critical"
                          ? `0 0 6px ${style.color}`
                          : "none",
                    }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span
                          className="text-[8px] font-bold px-1 py-0.5 rounded-sm flex-shrink-0"
                          style={{
                            color: style.color,
                            backgroundColor: style.bg,
                          }}
                        >
                          {style.label}
                        </span>
                        <span className="text-jl-text text-[11px] font-medium truncate min-w-0">
                          {alert.title}
                        </span>
                      </div>
                      <div className="text-jl-muted text-[9px] truncate">
                        {alert.description}
                      </div>
                      <div className="text-jl-muted text-[8px] mt-0.5">
                        {alert.source} · {formatTimestamp(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
