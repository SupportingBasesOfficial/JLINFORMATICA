import type { WindowsService } from "@/lib/mock/server-metrics";

interface ServicesPanelProps {
  services: WindowsService[];
}

const STATUS_STYLES: Record<
  string,
  { color: string; label: string; bg: string }
> = {
  running: {
    color: "#3DD68C",
    label: "Em execução",
    bg: "rgba(61,214,140,0.1)",
  },
  stopped: { color: "#E5484D", label: "Parado", bg: "rgba(229,72,77,0.1)" },
  paused: { color: "#F5A623", label: "Pausado", bg: "rgba(245,166,35,0.1)" },
};

export function ServicesPanel({ services }: ServicesPanelProps) {
  const stopped = services.filter((s) => s.status === "stopped");
  const running = services.filter((s) => s.status === "running");
  const total = services.length;
  const hasIssues = stopped.length > 0;

  return (
    <>
      <div className="text-jl-muted text-[11px] font-bold tracking-wide mx-0.5 mb-2.5">
        DISPONIBILIDADE DE SERVIÇOS DO WINDOWS
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-2.5 mb-4">
        {/* Alert card */}
        <div
          className="bg-jl-card rounded-md p-3.5 border transition-colors"
          style={{
            borderColor: hasIssues
              ? "rgba(229,72,77,0.35)"
              : "rgba(61,214,140,0.35)",
          }}
        >
          <div className="text-jl-muted text-[10px] font-bold mb-2.5">
            SERVIÇOS DO WINDOWS
          </div>
          <div className="flex items-center gap-2.5">
            {hasIssues ? (
              <>
                <span
                  className="inline-block w-3 h-3 rounded-full bg-jl-red"
                  style={{
                    animation: "jlblink 0.9s infinite",
                    boxShadow: "0 0 6px #E5484D",
                  }}
                />
                <span className="text-jl-red text-2xl font-bold">ATENÇÃO</span>
              </>
            ) : (
              <>
                <span
                  className="inline-block w-3 h-3 rounded-full bg-jl-green"
                  style={{ boxShadow: "0 0 6px #3DD68C" }}
                />
                <span className="text-jl-green text-2xl font-bold">OK</span>
              </>
            )}
          </div>
          <div className="text-jl-muted text-[10px] mt-2.5">
            {hasIssues
              ? `${stopped.length} de ${total} serviço(s) parado(s)`
              : `Todos os ${total} serviços operacionais`}
          </div>
          <div className="flex gap-3 mt-2 text-[9px]">
            <span className="text-jl-muted">
              <b className="text-jl-green">{running.length}</b> ativos
            </span>
            <span className="text-jl-muted">
              <b className="text-jl-red">{stopped.length}</b> parados
            </span>
          </div>
        </div>

        {/* Services table */}
        <div className="bg-jl-card rounded-md p-3 px-3.5 border border-transparent hover:border-jl-border transition-colors">
          <div className="text-jl-muted text-[9px] mb-2">
            Serviços Monitorados ({total})
          </div>
          <div className="overflow-x-auto jl-scroll">
            <div className="min-w-[280px]">
              <div className="grid grid-cols-[1fr_110px] pb-1 border-b border-jl-border mb-1">
                <span className="text-jl-muted text-[9px] font-bold">SERVIÇO</span>
                <span className="text-jl-muted text-[9px] font-bold">STATUS</span>
              </div>
              <div className="max-h-[180px] overflow-y-auto jl-scroll">
                {services.map((svc) => {
                  const style = STATUS_STYLES[svc.status] ?? STATUS_STYLES.running;
                  return (
                    <div
                      key={svc.name}
                      className="grid grid-cols-[1fr_110px] items-center py-1.5 hover:bg-white/5 rounded-sm transition-colors"
                    >
                      <span className="flex items-center gap-2 text-jl-text text-[11px] min-w-0">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: style.color }}
                        />
                        <span className="truncate">{svc.displayName}</span>
                        <span className="text-jl-muted text-[9px] truncate hidden sm:inline">
                          ({svc.name})
                        </span>
                      </span>
                      <span
                        className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-sm inline-block text-center"
                        style={{ color: style.color, backgroundColor: style.bg }}
                      >
                        {style.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
