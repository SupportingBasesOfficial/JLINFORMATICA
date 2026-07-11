import type {
  DiskDrive,
  DiskIopsPoint,
  DiskLatencyPoint,
  DiskQueuePoint,
} from "@/lib/mock/server-metrics";

interface DiskMetricsProps {
  drives: DiskDrive[];
  iops: DiskIopsPoint[];
  latency: DiskLatencyPoint[];
  queue: DiskQueuePoint[];
  latencySummary: { readMs: number; writeMs: number };
  queueSummary: { read: number; write: number };
}

function DualSparkline({
  values1,
  values2,
  color1,
  color2,
  label1,
  label2,
  height = 45,
  width = 300,
}: {
  values1: number[];
  values2: number[];
  color1: string;
  color2: string;
  label1: string;
  label2: string;
  height?: number;
  width?: number;
}) {
  const allValues = [...values1, ...values2];
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

  const last1 = values1[values1.length - 1];
  void last1;
  const last2 = values2[values2.length - 1];
  void last2;
  const gradId1 = `disk-grad-${label1.replace(/\s/g, "")}`;
  const gradId2 = `disk-grad-${label2.replace(/\s/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      height={height}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId1} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color1} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color1} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={gradId2} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color2} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color2} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`${toPoints(values1)} ${width},${height} 0,${height}`}
        fill={`url(#${gradId1})`}
      />
      <polygon
        points={`${toPoints(values2)} ${width},${height} 0,${height}`}
        fill={`url(#${gradId2})`}
      />
      <polyline
        points={toPoints(values1)}
        fill="none"
        stroke={color1}
        strokeWidth={1.5}
      />
      <polyline
        points={toPoints(values2)}
        fill="none"
        stroke={color2}
        strokeWidth={1.5}
      />
    </svg>
  );
}

export function DiskMetrics({
  drives,
  iops,
  latency,
  queue,
  latencySummary,
  queueSummary,
}: DiskMetricsProps) {
  const lastIops = iops[iops.length - 1];

  return (
    <>
      <div className="text-jl-muted text-[11px] font-bold tracking-wide mx-0.5 mb-2.5">
        DISCO — LEITURA E ESCRITA
      </div>

      {/* Row 1: Drive utilization + IOPS */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-2.5 mb-2.5">
        {/* Drive utilization */}
        <div className="jl-glass jl-gradient-border rounded-md p-3">
          <div className="text-jl-muted text-[9px] mb-2.5">
            Utilização por Disco (100% - tempo ocioso)
          </div>
          <div className="flex flex-col gap-2.5">
            {drives.map((drive, idx) => {
              const color =
                drive.utilization > 80
                  ? "#E5484D"
                  : drive.utilization > 50
                    ? "#F5A623"
                    : "#35D0C4";
              const freeBytes = drive.totalBytes - drive.usedBytes;
              const freeGB = (freeBytes / 1024 / 1024 / 1024).toFixed(0);
              const totalGB = (drive.totalBytes / 1024 / 1024 / 1024).toFixed(
                0,
              );
              // Projecao: se crescimento de 2% ao dia, em quantos dias lota
              const daysToFull =
                drive.utilization > 0 && drive.utilization < 100
                  ? Math.floor((100 - drive.utilization) / 2)
                  : 0;
              return (
                <div key={drive.letter}>
                  <div className="flex justify-between text-jl-text text-[10px] mb-1">
                    <span>
                      {idx} {drive.letter}{" "}
                      <span className="text-jl-muted/50 text-[8px]">
                        {freeGB}GB livres de {totalGB}GB
                      </span>
                    </span>
                    <span style={{ color }} className="font-bold">
                      {drive.utilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-white/5 h-[5px] rounded-sm overflow-hidden">
                    <div
                      className="h-[5px] rounded-sm transition-all duration-300"
                      style={{
                        width: `${drive.utilization}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 4px ${color}80`,
                      }}
                    />
                  </div>
                  {daysToFull > 0 && daysToFull < 30 && (
                    <div
                      className="text-[8px] mt-0.5"
                      style={{ color: daysToFull < 10 ? "#E5484D" : "#F5A623" }}
                    >
                      ⚡ Disco cheio em ~{daysToFull}d
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* IOPS */}
        <div className="jl-glass jl-gradient-border rounded-md p-3 px-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-jl-muted text-[9px]">
              IOPS — Leituras e Gravações por Segundo
            </span>
          </div>
          <div className="flex gap-3.5 mb-1.5 text-[10px]">
            <span className="flex items-center gap-1.5 text-jl-text">
              <span className="w-2 h-2 bg-jl-teal rounded-sm" />
              leitura
              <b className="text-jl-teal">{lastIops.read}</b>
            </span>
            <span className="flex items-center gap-1.5 text-jl-text">
              <span className="w-2 h-2 bg-jl-cyan rounded-sm" />
              gravação
              <b className="text-jl-cyan">{lastIops.write}</b>
            </span>
          </div>
          <DualSparkline
            values1={iops.map((p) => p.read)}
            values2={iops.map((p) => p.write)}
            color1="#1BA898"
            color2="#35D0C4"
            label1="iops-read"
            label2="iops-write"
            height={60}
            width={460}
          />
        </div>
      </div>

      {/* Row 2: Latency + Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-4">
        <div className="jl-glass jl-gradient-border rounded-md p-3 px-3.5">
          <div className="text-jl-muted text-[9px] mb-1.5">
            Latência de Leitura e Gravação (ms)
          </div>
          <DualSparkline
            values1={latency.map((p) => p.readMs)}
            values2={latency.map((p) => p.writeMs)}
            color1="#1BA898"
            color2="#35D0C4"
            label1="lat-read"
            label2="lat-write"
          />
          <div className="flex gap-3 text-[9px] mt-1">
            <span className="text-jl-muted">
              Leitura <b className="text-jl-teal">{latencySummary.readMs} ms</b>
            </span>
            <span className="text-jl-muted">
              Gravação{" "}
              <b className="text-jl-cyan">{latencySummary.writeMs} ms</b>
            </span>
          </div>
        </div>

        <div className="jl-glass jl-gradient-border rounded-md p-3 px-3.5">
          <div className="text-jl-muted text-[9px] mb-1.5">
            Fila de Disco (leitura/gravação)
          </div>
          <DualSparkline
            values1={queue.map((p) => p.read)}
            values2={queue.map((p) => p.write)}
            color1="#8E7CFF"
            color2="#3AA0FF"
            label1="q-read"
            label2="q-write"
          />
          <div className="flex gap-3 text-[9px] mt-1">
            <span className="text-jl-muted">
              Leitura <b style={{ color: "#8E7CFF" }}>{queueSummary.read}</b>
            </span>
            <span className="text-jl-muted">
              Gravação <b style={{ color: "#3AA0FF" }}>{queueSummary.write}</b>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
