"use client";

import { useState, useMemo } from "react";
import type { ProcessInfo } from "@/lib/mock/server-metrics";

interface ProcessTableProps {
  processes: ProcessInfo[];
}

type SortKey = "pid" | "name" | "cpuPercent" | "memMb";
type SortDir = "asc" | "desc";

function getCpuColor(cpu: number): string {
  if (cpu >= 50) return "#E5484D";
  if (cpu >= 20) return "#F5A623";
  return "#3DD68C";
}

function getMemColor(mb: number): string {
  if (mb >= 500) return "#E5484D";
  if (mb >= 200) return "#F5A623";
  return "#35D0C4";
}

function SortArrow({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== col) return <span className="text-jl-muted/40"> ↕</span>;
  return (
    <span className="text-jl-teal">{sortDir === "asc" ? " ↑" : " ↓"}</span>
  );
}

export function ProcessTable({ processes }: ProcessTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("cpuPercent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    const filtered = processes.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) || String(p.pid).includes(lower),
    );
    const sorted = [...filtered].sort((a, b) => {
      const getVal = (p: ProcessInfo, key: SortKey): string | number => {
        switch (key) {
          case "pid":
            return p.pid;
          case "name":
            return p.name;
          case "cpuPercent":
            return p.cpuPercent;
          case "memMb":
            return p.memMb;
        }
      };
      const av = getVal(a, sortKey);
      const bv = getVal(b, sortKey);
      const cmp =
        typeof av === "string"
          ? av.localeCompare(bv as string)
          : (av as number) - (bv as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [processes, search, sortKey, sortDir]);

  const maxCpu = Math.max(...filtered.map((p) => p.cpuPercent), 1);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mx-0.5 mb-1.5">
        <span className="text-jl-muted text-[11px] font-bold tracking-wide">
          PROCESSOS EM EXECUÇÃO
        </span>
        <input
          type="text"
          placeholder="buscar processo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-jl-card text-jl-text text-[10px] px-2.5 py-1 rounded border border-jl-border outline-none focus:border-jl-teal transition-colors w-[160px]"
        />
      </div>
      <div className="bg-jl-card rounded-md p-3 px-3.5 border border-transparent hover:border-jl-border transition-colors">
        <div className="grid grid-cols-[60px_1fr_90px_80px] pb-1.5 border-b border-jl-border mb-1">
          <button
            onClick={() => toggleSort("pid")}
            className="text-jl-muted text-[9px] font-bold text-left hover:text-jl-text transition-colors"
          >
            PID
            <SortArrow col="pid" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button
            onClick={() => toggleSort("name")}
            className="text-jl-muted text-[9px] font-bold text-left hover:text-jl-text transition-colors"
          >
            NOME
            <SortArrow col="name" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button
            onClick={() => toggleSort("cpuPercent")}
            className="text-jl-muted text-[9px] font-bold text-right hover:text-jl-text transition-colors"
          >
            CPU %
            <SortArrow col="cpuPercent" sortKey={sortKey} sortDir={sortDir} />
          </button>
          <button
            onClick={() => toggleSort("memMb")}
            className="text-jl-muted text-[9px] font-bold text-right hover:text-jl-text transition-colors"
          >
            MEM MB
            <SortArrow col="memMb" sortKey={sortKey} sortDir={sortDir} />
          </button>
        </div>
        <div className="max-h-[240px] overflow-y-auto jl-scroll">
          {filtered.length === 0 ? (
            <div className="py-3 text-center text-jl-muted text-[10px]">
              Nenhum processo encontrado para &quot;{search}&quot;
            </div>
          ) : (
            filtered.map((proc, idx) => (
              <div
                key={proc.pid}
                className="grid grid-cols-[60px_1fr_90px_80px] items-center py-1 hover:bg-white/5 rounded-sm transition-colors"
                style={{
                  backgroundColor:
                    idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                }}
              >
                <span className="text-jl-muted text-[10px]">{proc.pid}</span>
                <span className="text-jl-text text-[10px] truncate">
                  {proc.name}
                </span>
                <span className="flex items-center justify-end gap-1.5">
                  <span className="flex-1 max-w-[40px] bg-white/5 h-[3px] rounded-sm overflow-hidden">
                    <span
                      className="h-[3px] rounded-sm"
                      style={{
                        width: `${(proc.cpuPercent / maxCpu) * 100}%`,
                        backgroundColor: getCpuColor(proc.cpuPercent),
                      }}
                    />
                  </span>
                  <span
                    className="text-[10px] font-bold text-right w-[40px]"
                    style={{ color: getCpuColor(proc.cpuPercent) }}
                  >
                    {proc.cpuPercent.toFixed(1)}
                  </span>
                </span>
                <span
                  className="text-[10px] text-right"
                  style={{ color: getMemColor(proc.memMb) }}
                >
                  {proc.memMb}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="text-jl-muted text-[9px] mt-1.5 pt-1 border-t border-jl-border/50">
          {filtered.length} processo(s) exibido(s) de {processes.length} total
        </div>
      </div>
    </>
  );
}
