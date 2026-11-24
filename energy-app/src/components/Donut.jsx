// Donut.jsx - one country's energy mix in one year. The main ring has one
// slice per source; a thin outer ring splits the same total into fossil
// fuels and low-carbon. The centre shows the total, or the hovered source.
//
// Wrapper pattern:
//   ResponsiveDonut  measures its box with useDimensions
//   Donut            draws at a fixed width and height
import { useRef } from "react";
import { pie, arc } from "d3";
import { useDimensions } from "../hooks/useDimensions.js";
import { SOURCES, GROUPS, groupShare, twh, pct } from "../data/sources.js";

export function ResponsiveDonut(props) {
  const ref = useRef(null);
  const { width, height } = useDimensions(ref);
  return (
    <div ref={ref} className="chart-fill">
      {width > 0 && height > 0 && <Donut width={width} height={height} {...props} />}
    </div>
  );
}

//   row       the selected country's row for the selected year
//   active    key of the hovered source (or null)
//   onActive  called with a source key, or null, on hover
export function Donut({ width, height, row, active, onActive }) {
  const outer = Math.max(40, Math.min(width, height) / 2 - 6);
  const ringGap = 10;
  const radius = outer - ringGap;
  const inner = radius * 0.62;

  const slices = pie()
    .value((s) => row[s.key])
    .sort(null)
    .padAngle(0.006)(SOURCES.filter((s) => row[s.key] > 0));

  const sliceArc = arc().innerRadius(inner).outerRadius(radius).cornerRadius(2);
  const activeArc = arc().innerRadius(inner).outerRadius(radius + 4).cornerRadius(2);

  // Outer ring: fossil vs low-carbon (sources are ordered fossil first)
  const fossil = groupShare(row, "fossil");
  const fossilEnd = 2 * Math.PI * (fossil / (fossil + groupShare(row, "low")));
  const ring = arc().innerRadius(outer - 4).outerRadius(outer);
  const rings = [
    { key: "fossil", start: 0, end: fossilEnd },
    { key: "low", start: fossilEnd, end: 2 * Math.PI },
  ];

  const hovered = SOURCES.find((s) => s.key === active);

  return (
    <svg width={width} height={height} className="chart donut">
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {rings.map((r) => (
          <path
            key={r.key}
            d={ring({ startAngle: r.start, endAngle: r.end, padAngle: 0.01 })}
            fill={GROUPS[r.key].color}
            opacity={0.55}
          />
        ))}

        {slices.map((s) => (
          <path
            key={s.data.key}
            d={(s.data.key === active ? activeArc : sliceArc)(s)}
            fill={s.data.color}
            className={active && s.data.key !== active ? "slice dim" : "slice"}
            onPointerEnter={() => onActive(s.data.key)}
            onPointerLeave={() => onActive(null)}
          />
        ))}

        {hovered ? (
          <>
            <text className="donut-big" dy="0.1em" textAnchor="middle">
              {pct(row[hovered.key] / row.primary_energy, 1)}
            </text>
            <text className="donut-small" dy="1.9em" textAnchor="middle">
              {hovered.label} · {twh(row[hovered.key])} TWh
            </text>
          </>
        ) : (
          <>
            <text className="donut-big" dy="0.1em" textAnchor="middle">
              {twh(row.primary_energy)}
            </text>
            <text className="donut-small" dy="1.9em" textAnchor="middle">
              TWh in {row.year}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
