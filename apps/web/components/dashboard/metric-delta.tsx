interface MetricDeltaProps {
  current: number;
  previous: number;
  invertGood?: boolean;
  size?: "sm" | "md";
}

export function MetricDelta({
  current,
  previous,
  invertGood = false,
  size = "sm",
}: MetricDeltaProps) {
  const delta = current - previous;
  if (Math.abs(delta) < 0.1) return null;

  const isUp = delta > 0;
  const isGood = invertGood ? !isUp : isUp;

  const color = isGood ? "#3DD68C" : "#E5484D";
  const arrow = isUp ? "▲" : "▼";
  const textSize = size === "sm" ? "text-[8px]" : "text-[10px]";

  return (
    <span className={`${textSize} font-bold tabular-nums`} style={{ color }}>
      {arrow} {Math.abs(delta).toFixed(1)}
    </span>
  );
}
