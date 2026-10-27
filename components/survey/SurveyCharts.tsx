import { percent, type ChartSlice } from "@/lib/surveys/model";

function polar(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function wedge(cx: number, cy: number, radius: number, start: number, end: number) {
  const startPoint = polar(cx, cy, radius, start);
  const endPoint = polar(cx, cy, radius, end);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y} Z`;
}

export function SurveyPieChart({ slices }: { slices: ChartSlice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const size = 180;
  const center = size / 2;
  const radius = 78;

  if (!total) {
    return (
      <div className="flex h-44 items-center justify-center rounded-2xl bg-dark-50 text-sm text-dark-400">
        No answers yet
      </div>
    );
  }

  const active = slices.filter((slice) => slice.value > 0);
  let angle = 0;
  const paths = active.map((slice) => {
    const sweep = (slice.value / total) * 360;
    const start = angle;
    const end = angle + Math.min(sweep, 359.999);
    angle += sweep;
    return { ...slice, d: wedge(center, center, radius, start, end) };
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-44 w-44 shrink-0" role="img" aria-label="Pie chart">
        {active.length === 1 ? (
          <circle cx={center} cy={center} r={radius} fill={active[0].color} />
        ) : (
          paths.map((slice) => (
            <path key={slice.key} d={slice.d} fill={slice.color}>
              <title>{`${slice.label}: ${slice.value}`}</title>
            </path>
          ))
        )}
      </svg>
      <ul className="w-full space-y-2">
        {slices.map((slice) => (
          <li key={slice.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="truncate text-dark-700">{slice.label}</span>
            </span>
            <span className="shrink-0 font-medium text-dark-900">
              {slice.value} · {percent(slice.value, total)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SurveyBarChart({
  slices,
  denominator,
}: {
  slices: ChartSlice[];
  denominator: number;
}) {
  const max = Math.max(denominator, ...slices.map((slice) => slice.value), 1);
  if (!denominator && slices.every((slice) => slice.value === 0)) {
    return (
      <div className="flex h-44 items-center justify-center rounded-2xl bg-dark-50 text-sm text-dark-400">
        No answers yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slices.map((slice) => {
        const width = slice.value > 0 ? Math.max(4, (slice.value / max) * 100) : 0;
        return (
          <div key={slice.key}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="text-dark-700">{slice.label}</span>
              <span className="shrink-0 font-medium text-dark-900">
                {slice.value} · {percent(slice.value, denominator)}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-dark-100">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${width}%`, backgroundColor: slice.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
