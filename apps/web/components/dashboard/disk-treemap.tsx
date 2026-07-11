"use client";

import { useEffect, useRef } from "react";
import type * as EChartsType from "echarts";

import type { TreemapNode } from "@/lib/mock/server-metrics";

interface DiskTreemapProps {
  data: TreemapNode[];
}

const COLORS = {
  teal: "#1BA898",
  cyan: "#35D0C4",
  blue: "#3AA0FF",
  purple: "#8E7CFF",
  amber: "#F5A623",
  red: "#E5484D",
  green: "#3DD68C",
};

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + " GB";
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(1) + " KB";
}

export function DiskTreemap({ data }: DiskTreemapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<EChartsType.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    let disposed = false;
    let handleResize: (() => void) | null = null;

    // Dynamic import para evitar SSR issues com ECharts workers
    import("echarts")
      .then((echarts): void => {
        if (disposed || !chartRef.current) return;

        const chart = echarts.init(chartRef.current, null, { renderer: "svg" });
        chartInstance.current = chart;

        chart.setOption({
          backgroundColor: "transparent",
          tooltip: {
            backgroundColor: "#10171C",
            borderColor: "#1E2530",
            borderWidth: 1,
            textStyle: {
              color: "#C9D4DA",
              fontFamily: "'JetBrains Mono', 'Consolas', monospace",
              fontSize: 11,
            },
            formatter: (info: { name: string; value: number }) =>
              `<b>${info.name}</b><br/>${formatBytes(info.value)}`,
          },
          series: [
            {
              type: "treemap",
              data: data,
              roam: false,
              nodeClick: "zoomToNode",
              breadcrumb: {
                show: true,
                top: 0,
                itemStyle: {
                  color: "#0B1015",
                  borderColor: "#1E2530",
                },
                textStyle: {
                  color: "#C9D4DA",
                  fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                  fontSize: 10,
                },
              },
              label: {
                show: true,
                color: "#fff",
                fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                fontSize: 11,
              },
              upperLabel: {
                show: true,
                height: 22,
                color: "#C9D4DA",
                fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                fontSize: 11,
              },
              itemStyle: {
                borderColor: "#0B1015",
                borderWidth: 2,
                gapWidth: 2,
              },
              levels: [
                {
                  itemStyle: { borderWidth: 0, gapWidth: 2 },
                },
                {
                  color: [
                    COLORS.teal,
                    COLORS.cyan,
                    COLORS.blue,
                    COLORS.purple,
                    COLORS.amber,
                    COLORS.red,
                    COLORS.green,
                  ],
                  itemStyle: {
                    borderColor: "#0B1015",
                    borderWidth: 3,
                    gapWidth: 2,
                  },
                },
                {
                  colorSaturation: [0.35, 0.6],
                },
              ],
            },
          ],
        });

        handleResize = () => chart.resize();
        window.addEventListener("resize", handleResize);
      })
      .catch(() => {
        // ECharts pode falhar ao carregar no SSR — ignorar silenciosamente
      });

    return () => {
      disposed = true;
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return (
    <>
      <div className="text-jl-muted text-[11px] font-bold tracking-wide mx-0.5 mb-1.5">
        MAPA DE USO DE DISCO POR PASTA{" "}
        <span className="font-normal normal-case">
          (clique numa caixa para navegar)
        </span>
      </div>
      <div className="bg-jl-card rounded-md p-2 mb-4">
        <div className="text-jl-muted text-[10px] px-2 py-1">
          C: (Sistema) &gt; Users
        </div>
        <div ref={chartRef} className="w-full h-[340px]" />
      </div>
    </>
  );
}
