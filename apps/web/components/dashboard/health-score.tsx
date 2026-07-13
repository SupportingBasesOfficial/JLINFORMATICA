"use client";

import { getHealthLabel } from "@/lib/mock/server-metrics";

interface HealthScoreProps {
  score: number;
}

export function HealthScore({ score }: HealthScoreProps) {
  const { label, color } = getHealthLabel(score);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3 jl-glass jl-gradient-border rounded-md px-3.5 py-2 min-w-0 overflow-hidden">
      <div className="relative flex-shrink-0">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <defs>
            <linearGradient id="health-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="5"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="url(#health-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 32 32)"
            style={{
              transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease",
              filter: `drop-shadow(0 0 3px ${color}80)`,
            }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-lg font-bold"
          style={{ color }}
        >
          {score}
        </div>
      </div>

      <div className="min-w-0 overflow-hidden">
        <div className="text-jl-muted text-[9px] font-bold">HEALTH SCORE</div>
        <div className="text-sm font-bold truncate" style={{ color }}>
          {label}
        </div>
        <div className="text-jl-muted text-[8px] mt-0.5 truncate">
          CPU · Memória · Disco · Serviços
        </div>
      </div>
    </div>
  );
}
