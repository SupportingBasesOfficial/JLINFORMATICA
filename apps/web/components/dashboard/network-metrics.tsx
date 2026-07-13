import type { NetworkPoint } from "@/lib/mock/server-metrics";

interface NetworkMetricsProps {
  network: NetworkPoint[];
  summary: {
    avgInKbps: number;
    avgOutKbps: number;
    currentConnections: number;
  };
}

function formatKbps(kbps: number): string {
  if (kbps >= 1000) return `${(kbps / 1000).toFixed(1)} MB/s`;
  return `${Math.round(kbps)} KB/s`;
}

export function NetworkMetrics({ network, summary }: NetworkMetricsProps) {
  const width = 300;
  const height = 50;

  const allValues = [
    ...network.map((p) => p.kbpsIn),
    ...network.map((p) => p.kbpsOut),
  ];
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;

  const toPoints = (vals: number[]) =>
    vals
      .map((v, i) => {
        const x = (i / (vals.length - 1)) * width;
        const y = height - 5 - ((v - min) / range) * (height - 10);
        return `${x},${y}`;
      })
      .join(" ");

  const lastNet = network[network.length - 1];

  return (
    <>
      <div className="text-jl-muted text-[11px] font-bold tracking-wide mx-0.5 mb-2.5">
        REDE — TRÁFEGO E CONEXÕES
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2.5 mb-4">
        {/* Bandwidth sparkline */}
        <div className="bg-jl-card rounded-md p-3 px-3.5 border border-transparent hover:border-jl-border transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-jl-muted text-[9px]">
              Largura de Banda — Entrada e Saída
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3.5 gap-y-1 mb-1.5 text-[10px]">
            <span className="flex items-center gap-1.5 text-jl-text">
              <span className="w-2 h-2 bg-jl-blue rounded-sm" />
              entrada
              <b className="text-jl-blue">{formatKbps(lastNet.kbpsIn)}</b>
            </span>
            <span className="flex items-center gap-1.5 text-jl-text">
              <span className="w-2 h-2 bg-jl-purple rounded-sm" />
              saída
              <b className="text-jl-purple">{formatKbps(lastNet.kbpsOut)}</b>
            </span>
          </div>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
            height={height}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="net-grad-in" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3AA0FF" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3AA0FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="net-grad-out" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8E7CFF" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#8E7CFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <polygon
              points={`${toPoints(network.map((p) => p.kbpsIn))} ${width},${height} 0,${height}`}
              fill="url(#net-grad-in)"
            />
            <polygon
              points={`${toPoints(network.map((p) => p.kbpsOut))} ${width},${height} 0,${height}`}
              fill="url(#net-grad-out)"
            />
            <polyline
              points={toPoints(network.map((p) => p.kbpsIn))}
              fill="none"
              stroke="#3AA0FF"
              strokeWidth={1.5}
            />
            <polyline
              points={toPoints(network.map((p) => p.kbpsOut))}
              fill="none"
              stroke="#8E7CFF"
              strokeWidth={1.5}
            />
          </svg>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] mt-1">
            <span className="text-jl-muted">
              Média entrada{" "}
              <b className="text-jl-blue">{formatKbps(summary.avgInKbps)}</b>
            </span>
            <span className="text-jl-muted">
              Média saída{" "}
              <b className="text-jl-purple">{formatKbps(summary.avgOutKbps)}</b>
            </span>
          </div>
        </div>

        {/* Connections card */}
        <div className="bg-jl-card rounded-md p-3 px-3.5 border border-transparent hover:border-jl-border transition-colors">
          <div className="text-jl-muted text-[9px] mb-2">Conexões Ativas</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-jl-cyan">
              {summary.currentConnections}
            </span>
            <span className="text-jl-muted text-[10px]">conexões</span>
          </div>
          <div className="mt-3">
            <div className="text-jl-muted text-[9px] mb-1">Variação (24h)</div>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full"
              height={height}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="net-grad-conn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#35D0C4" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#35D0C4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <polygon
                points={`${toPoints(network.map((p) => p.connections))} ${width},${height} 0,${height}`}
                fill="url(#net-grad-conn)"
              />
              <polyline
                points={toPoints(network.map((p) => p.connections))}
                fill="none"
                stroke="#35D0C4"
                strokeWidth={1.5}
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
