"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Fixed categorical order, validated for CVD-safety (adjacent-pair OKLab ΔE) in
// both light and dark modes via the dataviz skill's validator — see
// .squad/plans/dashboards/06-story-activity-dashboards-and-stats.md. Reuses this
// app's own chart-1..5 design tokens (src/shared/styles/themes.css), except slot 1
// (chart-1) which is bumped from the Figma-exported light value (#F5BD02, too pale
// to clear the OKLCH lightness band) to the value the theme already uses for dark
// mode (#DBA102) — validated as passing in both modes, so used unconditionally
// rather than adding light/dark branching for a single slot. themes.css itself is
// generated from Figma tokens and isn't hand-edited; this override lives only here.
const SLOT_COLORS: Record<string, string> = {
  New: "#DBA102",
  InProgress: "#80519F",
  Rejected: "#25935F",
  Cancelled: "#2E90FA",
  Done: "#F79009",
};
const FALLBACK_COLOR = "#898781"; // muted — only hit for a status key not in the fixed set above

const CX = 50;
const CY = 50;
const R_OUTER = 45;
const R_INNER = 27;

function polarToCartesian(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.sin(rad), y: CY - radius * Math.cos(rad) };
}

function describeDonutSlice(startAngle: number, endAngle: number) {
  const p0 = polarToCartesian(R_OUTER, startAngle);
  const p1 = polarToCartesian(R_OUTER, endAngle);
  const p2 = polarToCartesian(R_INNER, endAngle);
  const p3 = polarToCartesian(R_INNER, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${p0.x} ${p0.y}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${p3.x} ${p3.y}`,
    "Z",
  ].join(" ");
}

type Slice = { key: string; count: number; color: string; start: number; end: number };

export function StatusPieChart({
  title,
  counts,
}: {
  title: string;
  counts: Record<string, number>;
}) {
  const t = useTranslations("enums.taskItemStatus");
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const entries = Object.entries(counts);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  let cumulative = 0;
  const slices: Slice[] = entries.map(([key, count]) => {
    const start = total === 0 ? 0 : (cumulative / total) * 360;
    cumulative += count;
    const end = total === 0 ? 0 : (cumulative / total) * 360;
    return { key, count, color: SLOT_COLORS[key] ?? FALLBACK_COLOR, start, end };
  });

  const hoveredSlice = slices.find((s) => s.key === hovered) ?? null;

  // Single source of truth for hover: read whichever slice element is actually
  // under the pointer on every move, rather than letting each slice's own
  // enter/move handler race with a parent handler (that caused a real bug —
  // moving directly between adjacent slices showed the previous slice's data
  // until the pointer left and re-entered, because a parent-level handler was
  // re-firing with a stale `hovered` closure after the child's handler already
  // updated it, in the same bubble pass).
  function handlePointerMove(event: React.MouseEvent<SVGSVGElement>) {
    const target = (event.target as Element).closest<SVGElement>("[data-slice-key]");
    const rect = event.currentTarget.getBoundingClientRect();
    const pos = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (!target) {
      setHovered(null);
      setTooltipPos(null);
      return;
    }
    setHovered(target.dataset.sliceKey ?? null);
    setTooltipPos(pos);
  }

  function handlePointerLeave() {
    setHovered(null);
    setTooltipPos(null);
  }

  function showTooltipAtCenter(key: string, event: { currentTarget: Element }) {
    setHovered(key);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.width / 2, y: rect.height / 2 });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">—</p>
        ) : (
          <>
            <div className="relative size-28 shrink-0">
              <svg
                viewBox="0 0 100 100"
                className="size-full"
                onMouseMove={handlePointerMove}
                onMouseLeave={handlePointerLeave}
              >
                {slices.length === 1 ? (
                  <g
                    data-slice-key={slices[0].key}
                    tabIndex={0}
                    className="cursor-pointer outline-none"
                    style={{ opacity: hovered && hovered !== slices[0].key ? 0.6 : 1 }}
                    onFocus={(e) => showTooltipAtCenter(slices[0].key, e)}
                    onBlur={handlePointerLeave}
                  >
                    <circle cx={CX} cy={CY} r={R_OUTER} fill={slices[0].color} />
                    <circle cx={CX} cy={CY} r={R_INNER} className="fill-card" />
                  </g>
                ) : (
                  slices.map((s) => (
                    <path
                      key={s.key}
                      data-slice-key={s.key}
                      d={describeDonutSlice(s.start, s.end)}
                      fill={s.color}
                      tabIndex={0}
                      className="cursor-pointer outline-none transition-opacity"
                      style={{ opacity: hovered && hovered !== s.key ? 0.6 : 1 }}
                      onFocus={(e) => showTooltipAtCenter(s.key, e)}
                      onBlur={handlePointerLeave}
                    >
                      <title>
                        {t(s.key)}: {s.count} ({Math.round((s.count / total) * 100)}%)
                      </title>
                    </path>
                  ))
                )}
              </svg>
              <div className="pointer-events-none absolute inset-3 flex items-center justify-center rounded-full bg-card">
                <span className="text-lg font-semibold">{total}</span>
              </div>
              {hoveredSlice && tooltipPos && (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground shadow-md"
                  style={{ left: tooltipPos.x, top: tooltipPos.y - 8 }}
                >
                  <span className="font-semibold">{hoveredSlice.count}</span>{" "}
                  <span className="text-muted-foreground">
                    {t(hoveredSlice.key)} (
                    {Math.round((hoveredSlice.count / total) * 100)}%)
                  </span>
                </div>
              )}
            </div>
            <ul className="flex flex-col gap-1 text-sm">
              {slices.map((s) => (
                <li key={s.key} className="flex items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-muted-foreground">{t(s.key)}</span>
                  <span className="font-medium">{s.count}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((s.count / total) * 100)}%)
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
