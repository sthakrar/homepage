// LineChart.jsx - the rise of low-carbon energy: each low-carbon source's
// share of a country's energy over time, plus their total as a bold line.
// Lines are labelled at their right end instead of with a legend.
//
// Wrapper pattern:
//   ResponsiveLineChart  measures its box with useDimensions
//   LineChart            draws at a fixed width and height
import { useMemo, useRef, useState } from "react";
import { scaleLinear, line, curveMonotoneX, max } from "d3";
import { useDimensions } from "../hooks/useDimensions.js";
import { SOURCES, GROUPS, groupShare, share, pct } from "../data/sources.js";
import { YearTooltip, yearTicks, nearestYear } from "./chartParts.jsx";

// The lines: the low-carbon total, then the four biggest low-carbon sources
export const LINES = [
  { key: "low", label: "All low-carbon", color: GROUPS.low.color, total: true },
  ...["hydro", "nuclear", "wind", "solar"].map((k) => SOURCES.find((s) => s.key === k)),
];

const valueOf = (row, l) => (l.total ? groupShare(row, "low") : share(row, l.key));

export function ResponsiveLineChart(props) {
  const ref = useRef(null);
  const { width, height } = useDimensions(ref);
  return (
    <div ref={ref} className="chart-fill">
      {width > 0 && height > 0 && <LineChart width={width} height={height} {...props} />}
    </div>
  );
}

//   rows    one country's rows, oldest first
//   year    the dashboard's selected year (drawn as a marker)
//   onYear  called with a year when the chart is clicked
export function LineChart({ width, height, rows, year, onYear }) {
  const [hover, setHover] = useState(null);
  const compact = width < 480;
  const margin = { top: 14, right: compact ? 84 : 112, bottom: 28, left: 40 };
  const boundsW = width - margin.left - margin.right;
  const boundsH = height - margin.top - margin.bottom;

  const { x, y, years } = useMemo(() => {
    const years = rows.map((d) => d.year);
    const top = max(rows, (d) => groupShare(d, "low"));
    return {
      years,
      x: scaleLinear().domain([years[0], years.at(-1)]).range([0, boundsW]),
      y: scaleLinear().domain([0, Math.max(0.1, top)]).range([boundsH, 0]).nice(5),
    };
  }, [rows, boundsW, boundsH]);

  const path = (l) =>
    line()
      .x((d) => x(d.year))
      .y((d) => y(valueOf(d, l)))
      .curve(curveMonotoneX)(rows);

  // End labels, nudged apart so they never overlap (at least 13px)
  const last = rows.at(-1);
  const labels = LINES.map((l) => ({ ...l, y: y(valueOf(last, l)) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i++) {
    labels[i].y = Math.max(labels[i].y, labels[i - 1].y + 13);
  }

  const hoverRow = hover && rows.find((d) => d.year === hover);

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    setHover(nearestYear(x, years, e.clientX - box.left));
  };

  return (
    <div className="chart-frame">
      <svg width={width} height={height} className="chart">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {y.ticks(5).map((t) => (
            <g key={t} transform={`translate(0, ${y(t)})`} className="grid">
              <line x2={boundsW} />
              <text x={-8} dy="0.32em" textAnchor="end" className="tick">{pct(t)}</text>
            </g>
          ))}
          {yearTicks(x, boundsW).map((t) => (
            <text key={t} x={x(t)} y={boundsH + 18} textAnchor="middle" className="tick">{t}</text>
          ))}
          <line className="baseline" x2={boundsW} y1={boundsH} y2={boundsH} />

          {year >= years[0] && year <= years.at(-1) && (
            <g transform={`translate(${x(year)}, 0)`} className="year-marker">
              <line y1={-4} y2={boundsH} />
            </g>
          )}

          {/* Thin source lines first, the bold total on top */}
          {[...LINES].reverse().map((l) => (
            <path
              key={l.key}
              d={path(l)}
              className={l.total ? "line line-total" : "line"}
              stroke={l.color}
            />
          ))}

          {/* End labels */}
          {labels.map((l) => (
            <g key={l.key}>
              <circle cx={boundsW} cy={y(valueOf(last, l))} r={l.total ? 4 : 3} fill={l.color} />
              <text
                x={boundsW + 8}
                y={l.y}
                dy="0.32em"
                className={l.total ? "end-label end-label-total" : "end-label"}
                fill={l.color}
              >
                {`${l.total ? (compact ? "Total" : "Low-carbon") : l.label} ${pct(valueOf(last, l))}`}
              </text>
            </g>
          ))}

          {hoverRow &&
            LINES.map((l) => (
              <circle
                key={l.key}
                cx={x(hover)}
                cy={y(valueOf(hoverRow, l))}
                r={3.5}
                fill="#fff"
                stroke={l.color}
                strokeWidth={2}
              />
            ))}

          <rect
            width={boundsW}
            height={boundsH}
            className="hit"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            onClick={() => hover && onYear(hover)}
          />
        </g>
      </svg>

      {hoverRow && (
        <YearTooltip
          year={hover}
          x={margin.left + x(hover)}
          width={width}
          rows={LINES.map((l) => ({
            key: l.key,
            label: l.label,
            color: l.color,
            value: pct(valueOf(hoverRow, l), 1),
          }))}
          footer="Share of all energy used · click to select"
        />
      )}
    </div>
  );
}
