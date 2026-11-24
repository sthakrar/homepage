// StackedArea.jsx - one country's energy use by source over time, as
// stacked areas. Shows either TWh or each source's share of the total.
//
// Wrapper pattern:
//   ResponsiveStackedArea  measures its box with useDimensions and passes
//                          width and height down
//   StackedArea            draws at a fixed width and height
//
// Hovering shows the values for the nearest year; clicking picks that
// year for the whole dashboard (the donut and the bar chart follow it).
import { useMemo, useRef, useState } from "react";
import { scaleLinear, stack, area, curveMonotoneX, max } from "d3";
import { useDimensions } from "../hooks/useDimensions.js";
import { SOURCES, twh, pct } from "../data/sources.js";
import { YearTooltip, yearTicks, nearestYear } from "./chartParts.jsx";

const MARGIN = { top: 14, right: 14, bottom: 28, left: 46 };

export function ResponsiveStackedArea(props) {
  const ref = useRef(null);
  const { width, height } = useDimensions(ref);
  return (
    <div ref={ref} className="chart-fill">
      {width > 0 && height > 0 && <StackedArea width={width} height={height} {...props} />}
    </div>
  );
}

//   rows    one country's rows, oldest first
//   mode    "twh" or "share"
//   year    the dashboard's selected year (drawn as a marker)
//   onYear  called with a year when the chart is clicked
export function StackedArea({ width, height, rows, mode, year, onYear }) {
  const [hover, setHover] = useState(null);
  const boundsW = width - MARGIN.left - MARGIN.right;
  const boundsH = height - MARGIN.top - MARGIN.bottom;
  const asShare = mode === "share";

  const { x, y, layers, years } = useMemo(() => {
    const years = rows.map((d) => d.year);
    const values = rows.map((d) =>
      Object.fromEntries([
        ["year", d.year],
        ...SOURCES.map((s) => [s.key, asShare ? d[s.key] / d.primary_energy : d[s.key]]),
      ])
    );
    const layers = stack().keys(SOURCES.map((s) => s.key))(values);
    const x = scaleLinear().domain([years[0], years.at(-1)]).range([0, boundsW]);
    const top = asShare ? 1 : max(layers.at(-1), (d) => d[1]);
    const y = scaleLinear().domain([0, top]).range([boundsH, 0]).nice(5);
    return { x, y, layers, years };
  }, [rows, asShare, boundsW, boundsH]);

  const path = area()
    .x((d) => x(d.data.year))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))
    .curve(curveMonotoneX);

  const fmtY = asShare ? (v) => pct(v) : (v) => twh(v);
  const shown = hover ?? null;
  const hoverRow = shown && rows.find((d) => d.year === shown);

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    setHover(nearestYear(x, years, e.clientX - box.left));
  };

  return (
    <div className="chart-frame">
      <svg width={width} height={height} className="chart">
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {/* Gridlines and y labels */}
          {y.ticks(5).map((t) => (
            <g key={t} transform={`translate(0, ${y(t)})`} className="grid">
              <line x2={boundsW} />
              <text x={-8} dy="0.32em" textAnchor="end" className="tick">{fmtY(t)}</text>
            </g>
          ))}

          {layers.map((layer, i) => (
            <path key={layer.key} d={path(layer)} fill={SOURCES[i].color} className="layer" />
          ))}

          {/* x labels */}
          {yearTicks(x, boundsW).map((t) => (
            <text key={t} x={x(t)} y={boundsH + 18} textAnchor="middle" className="tick">{t}</text>
          ))}
          <line className="baseline" x2={boundsW} y1={boundsH} y2={boundsH} />

          {/* Selected year */}
          {year >= years[0] && year <= years.at(-1) && (
            <g transform={`translate(${x(year)}, 0)`} className="year-marker">
              <line y1={-4} y2={boundsH} />
            </g>
          )}

          {/* Hovered year */}
          {hoverRow && (
            <line className="hover-line" x1={x(shown)} x2={x(shown)} y1={0} y2={boundsH} />
          )}

          {/* Pointer surface on top */}
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
          year={shown}
          x={MARGIN.left + x(shown)}
          width={width}
          rows={[...SOURCES].reverse().map((s) => ({
            key: s.key,
            label: s.label,
            color: s.color,
            value: asShare
              ? pct(hoverRow[s.key] / hoverRow.primary_energy, 1)
              : `${twh(hoverRow[s.key])} TWh`,
          }))}
          footer={`Total ${twh(hoverRow.primary_energy)} TWh · click to select`}
        />
      )}
    </div>
  );
}
