"use client";

import { useState, useRef, useEffect } from "react";
import type { GaugeAverage } from "@/lib/mock/server-metrics";

function getGaugeColor(value: number): string {
  if (value >= 90) return "#E5484D";
  if (value >= 70) return "#F5A623";
  return "#1BA898";
}

interface GaugeProps {
  label: string;
  value: number;
  color: string;
  avg: GaugeAverage;
}

function Gauge({ label, value, color, avg }: GaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(value * eased);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const displayValue = animatedValue;
  const startAngle = 180;
  const endAngle = 360;
  const valueAngle =
    startAngle + (displayValue / 100) * (endAngle - startAngle);

  const radius = 45;
  const cx = 60;
  const cy = 70;

  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const valuePoint = polarToCartesian(valueAngle);

  const largeArcBg = endAngle - startAngle > 180 ? 1 : 0;
  const largeArcValue = valueAngle - startAngle > 180 ? 1 : 0;

  const bgPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcBg} 1 ${end.x} ${end.y}`;
  const valuePath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcValue} 1 ${valuePoint.x} ${valuePoint.y}`;

  const ticks = [0, 25, 50, 75, 100].map((pct) => {
    const angle = startAngle + (pct / 100) * (endAngle - startAngle);
    const outer = polarToCartesian(angle);
    const innerRad = radius - 6;
    const rad = (angle * Math.PI) / 180;
    return {
      x1: outer.x,
      y1: outer.y,
      x2: cx + innerRad * Math.cos(rad),
      y2: cy + innerRad * Math.sin(rad),
      pct,
    };
  });

  const gradientId = `gauge-grad-${label.replace(/\s/g, "")}`;

  return (
    <div className="group relative jl-glass jl-gradient-border rounded-md p-2.5 flex flex-col items-center cursor-pointer">
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-jl-bg border border-jl-border rounded-md px-3 py-2 text-[11px] leading-relaxed opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 z-10 shadow-lg w-[200px] max-w-[calc(100vw-1rem)]">
        <div className="text-jl-muted font-bold mb-0.5">MÉDIA DE {label}</div>
        <div className="flex flex-col gap-0.5">
          <span>
            1 min: <b className="text-jl-text">{avg.avg1.toFixed(1)}%</b>
          </span>
          <span>
            5 min: <b className="text-jl-text">{avg.avg5.toFixed(1)}%</b>
          </span>
          <span>
            15 min: <b className="text-jl-text">{avg.avg15.toFixed(1)}%</b>
          </span>
        </div>
      </div>

      <svg
        viewBox="0 0 120 80"
        className="w-full max-w-[140px] transition-[filter] duration-150 group-hover:brightness-110"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
          <filter id={`glow-${gradientId}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d={valuePath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={9}
          strokeLinecap="round"
          filter={`url(#glow-${gradientId})`}
        />
        {ticks.map((t) => (
          <line
            key={t.pct}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
        ))}
        <text
          x={60}
          y={56}
          textAnchor="middle"
          fill={color}
          fontSize={20}
          fontWeight="bold"
          fontFamily="JetBrains Mono, Consolas, monospace"
        >
          {displayValue.toFixed(0)}%
        </text>
        <text
          x={60}
          y={74}
          textAnchor="middle"
          fill="#6E7F88"
          fontSize={8}
          fontFamily="JetBrains Mono, Consolas, monospace"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

interface SparklineProps {
  values: number[];
  color: string;
  label: string;
}

function Sparkline({ values, color, label }: SparklineProps) {
  const width = 300;
  const height = 70;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - 10 - ((v - min) / range) * (height - 20);
    return { x, y, v };
  });

  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  const gradientId = `sparkline-grad-${label.replace(/\s/g, "")}`;
  const lastValue = values[values.length - 1];
  const lastX = width;
  const lastY = height - 10 - ((lastValue - min) / range) * (height - 20);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const xPx = ((e.clientX - rect.left) / rect.width) * width;
    const idx = Math.round((xPx / width) * (values.length - 1));
    setHoverIdx(Math.max(0, Math.min(values.length - 1, idx)));
  };

  const hoverPoint = hoverIdx !== null ? (points.at(hoverIdx) ?? null) : null;

  return (
    <div className="jl-glass jl-gradient-border rounded-md p-2.5 px-3.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-jl-muted text-[9px]">{label}</span>
        <span className="text-[10px] font-bold" style={{ color }}>
          {hoverIdx !== null && values.at(hoverIdx) !== undefined
            ? values.at(hoverIdx)!.toFixed(2)
            : lastValue.toFixed(2)}
        </span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        height={height}
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polyline
          points={pointsStr}
          fill="none"
          stroke={color}
          strokeWidth={2}
        />
        <polygon
          points={`${pointsStr} ${width},${height} 0,${height}`}
          fill={`url(#${gradientId})`}
        />
        <circle
          cx={lastX}
          cy={lastY}
          r={2.5}
          fill={color}
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
        {hoverPoint && (
          <>
            <line
              x1={hoverPoint.x}
              y1={0}
              x2={hoverPoint.x}
              y2={height - 10}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="2,2"
              opacity={0.5}
            />
            <circle
              cx={hoverPoint.x}
              cy={hoverPoint.y}
              r={3.5}
              fill={color}
              stroke="#0B1015"
              strokeWidth={1.5}
            />
          </>
        )}
        <line
          x1={0}
          y1={height - 10}
          x2={width}
          y2={height - 10}
          stroke="#1E2530"
          strokeWidth={1}
        />
      </svg>
      {hoverIdx !== null && (
        <div className="text-[8px] text-jl-muted mt-0.5 text-right">
          ponto {hoverIdx + 1}/{values.length}
        </div>
      )}
    </div>
  );
}

interface PerformanceGaugesProps {
  cpuGauge: GaugeAverage;
  memGauge: GaugeAverage;
  cpuQueue: number[];
}

export function PerformanceGauges({
  cpuGauge,
  memGauge,
  cpuQueue,
}: PerformanceGaugesProps) {
  const cpuColor = getGaugeColor(cpuGauge.current);
  const memColor = getGaugeColor(memGauge.current);

  return (
    <>
      <div className="text-jl-muted text-[11px] font-bold tracking-wide mx-0.5 mb-1.5">
        DESEMPENHO{" "}
        <span className="font-normal normal-case hidden sm:inline">
          (passe o mouse nos gauges e na sparkline)
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_2fr] gap-2.5 mb-4">
        <Gauge
          label="CPU"
          value={cpuGauge.current}
          color={cpuColor}
          avg={cpuGauge}
        />
        <Gauge
          label="MEMÓRIA"
          value={memGauge.current}
          color={memColor}
          avg={memGauge}
        />
        <div className="col-span-2 md:col-span-1">
          <Sparkline values={cpuQueue} color={cpuColor} label="Fila de CPU" />
        </div>
      </div>
    </>
  );
}
