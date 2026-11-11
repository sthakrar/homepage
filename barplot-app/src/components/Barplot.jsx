// Barplot.jsx - a horizontal bar chart, one bar per country.
//
// D3 does only the math: two scales that turn data into pixel positions.
//   - scaleBand:   country name  -> y position and bar thickness
//   - scaleLinear: student count -> bar length
// React does all the rendering, as plain SVG elements in JSX.
// (No d3.select or d3.append anywhere.)
import { scaleBand, scaleLinear, max } from "d3";

// Space around the bars: left for country names, top for the axis numbers,
// right so the value at the end of the longest bar isn't cut off
const MARGIN = { top: 28, right: 36, bottom: 8, left: 112 };
const ROW_HEIGHT = 26; // vertical space per country

export default function Barplot({ data, width }) {
  const height = MARGIN.top + data.length * ROW_HEIGHT + MARGIN.bottom;
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  // Y: one band per country, in the order given (largest first)
  const yScale = scaleBand()
    .domain(data.map((d) => d.country))
    .range([0, innerHeight])
    .padding(0.28);

  // X: 0 students at the left edge, the largest count at the right edge
  const xScale = scaleLinear()
    .domain([0, max(data, (d) => d.students)])
    .range([0, innerWidth])
    .nice();

  // About one gridline per 80px of width
  const ticks = xScale.ticks(Math.max(2, Math.floor(innerWidth / 80)));

  return (
    <svg
      className="barplot"
      width={width}
      height={height}
      role="img"
      aria-label="Horizontal bar chart of students per country"
    >
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        {/* Vertical gridlines with their numbers along the top */}
        {ticks.map((tick) => (
          <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
            <line className="grid" y1={-6} y2={innerHeight} />
            <text className="tick" y={-12} textAnchor="middle">
              {tick}
            </text>
          </g>
        ))}

        {/* One row per country: name, bar and value */}
        {data.map((d) => {
          const y = yScale(d.country);
          const barWidth = xScale(d.students);
          return (
            <g key={d.country} className="row">
              <text
                className="label"
                x={-10}
                y={y + yScale.bandwidth() / 2}
                textAnchor="end"
                dominantBaseline="central"
              >
                {d.country}
              </text>
              <rect
                className="bar"
                x={0}
                y={y}
                width={barWidth}
                height={yScale.bandwidth()}
                rx={3}
              />
              <text
                className="value"
                x={barWidth + 6}
                y={y + yScale.bandwidth() / 2}
                dominantBaseline="central"
              >
                {d.students}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
