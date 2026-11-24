// BarChart.jsx - every country's energy use in one year, largest first.
// Each bar is split into fossil fuels (left) and low-carbon (right).
// Clicking a bar picks that country for the whole dashboard.
//
// Wrapper pattern:
//   ResponsiveBarChart  measures its box with useDimensions
//   BarChart            draws at a fixed width and height
import { useMemo, useRef } from "react";
import { scaleBand, scaleLinear, max } from "d3";
import { useDimensions } from "../hooks/useDimensions.js";
import { SOURCES, GROUPS, twh } from "../data/sources.js";

const sumOf = (row, group) =>
  SOURCES.filter((s) => s.group === group).reduce((t, s) => t + row[s.key], 0);

export function ResponsiveBarChart(props) {
  const ref = useRef(null);
  const { width, height } = useDimensions(ref);
  return (
    <div ref={ref} className="chart-fill">
      {width > 0 && height > 0 && <BarChart width={width} height={height} {...props} />}
    </div>
  );
}

//   rows       one row per country for the selected year
//   country    the selected country ("World" = none highlighted)
//   onCountry  called with a country name when a bar is clicked
export function BarChart({ width, height, rows, country, onCountry }) {
  const compact = width < 520;
  const margin = { top: 4, right: compact ? 40 : 56, bottom: 4, left: compact ? 92 : 128 };
  const boundsW = width - margin.left - margin.right;
  const boundsH = height - margin.top - margin.bottom;

  const sorted = useMemo(
    () => [...rows].sort((a, b) => b.primary_energy - a.primary_energy),
    [rows]
  );

  const y = scaleBand()
    .domain(sorted.map((d) => d.country))
    .range([0, boundsH])
    .padding(0.22);
  const x = scaleLinear()
    .domain([0, max(sorted, (d) => d.primary_energy)])
    .range([0, boundsW]);

  const highlight = country !== "World";
  const fontSize = Math.max(9, Math.min(12, y.step() * 0.72));
  const short = (name) =>
    compact ? name.replace("United Arab Emirates", "UAE").replace("United States", "USA").replace("United Kingdom", "UK") : name;

  return (
    <svg width={width} height={height} className="chart bars">
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {sorted.map((d) => {
          const fossil = sumOf(d, "fossil");
          const low = sumOf(d, "low");
          const isOn = d.country === country;
          return (
            <g
              key={d.country}
              transform={`translate(0, ${y(d.country)})`}
              className={`bar-row${highlight && !isOn ? " dim" : ""}${isOn ? " on" : ""}`}
              onClick={() => onCountry(isOn ? "World" : d.country)}
            >
              {/* Full-width hit area so thin bars are easy to click */}
              <rect x={-margin.left} width={width} y={-y.paddingInner() * y.step() / 2} height={y.step()} className="row-hit" />
              <text x={-8} y={y.bandwidth() / 2} dy="0.32em" textAnchor="end" className="bar-name" fontSize={fontSize}>
                {short(d.country)}
              </text>
              <rect width={x(fossil)} height={y.bandwidth()} fill={GROUPS.fossil.color} rx={1.5} />
              <rect x={x(fossil)} width={x(low)} height={y.bandwidth()} fill={GROUPS.low.color} rx={1.5} />
              <text x={x(d.primary_energy) + 6} y={y.bandwidth() / 2} dy="0.32em" className="bar-value" fontSize={fontSize - 1}>
                {twh(d.primary_energy)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
