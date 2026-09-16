import { fmtPct } from "@/lib/format";

export type DonutSlice = {
  label: string;
  value: number;
};

// Muted, warm palette that stays consistent with the site's brass/sage/brick
// theme instead of default chart-library colors.
const PALETTE = ["#c6a15c", "#7fa98d", "#c17b6e", "#7c93b3", "#a68bc0", "#b8b46a", "#d68a5f", "#8f8f97"];

export function DonutChart({ slices, size = 200 }: { slices: DonutSlice[]; size?: number }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total <= 0) return null;

  const strokeWidth = size * 0.16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const sorted = [...slices].sort((a, b) => b.value - a.value);
  const arcs = sorted.reduce<{ color: string; dash: number; gap: number; offset: number }[]>((acc, slice, i) => {
    const frac = slice.value / total;
    const dash = frac * circumference;
    const offsetAccum = acc.reduce((sum, a) => sum + a.dash, 0);
    acc.push({ color: PALETTE[i % PALETTE.length], dash, gap: circumference - dash, offset: -offsetAccum });
    return acc;
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0">
        <g transform={`rotate(-90 ${center} ${center})`}>
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={a.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${a.dash} ${a.gap}`}
              strokeDashoffset={a.offset}
            />
          ))}
        </g>
      </svg>
      <div className="w-full space-y-2">
        {sorted.map((slice, i) => (
          <div key={slice.label} className="flex items-center justify-between text-sm gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
              />
              <span className="text-text-muted truncate">{slice.label}</span>
            </div>
            <span className="font-mono tabular text-text shrink-0">{fmtPct(slice.value / total, 1).replace("+", "")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
