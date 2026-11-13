// Barplot.jsx - a horizontal bar chart in the style of The Economist:
// gridlines with their values along the top, a solid baseline at zero,
// and each name with its count, e.g. "Ebola (n=9)", written inside its bar
// (or just outside, if the bar is too short to hold it).
//
// D3 does only the math (scaleBand, scaleLinear). React renders the SVG.
import { scaleBand, scaleLinear, max } from "d3";

const MARGIN = { top: 26, right: 12, bottom: 4, left: 0 };
const ROW_HEIGHT = 34;    // vertical space per bar
const LABEL_SIZE = 13;    // font size of the names, in px
const LABEL_PAD = 8;      // gap between a bar's start and its name

// Rough width of a name in pixels, to decide whether it fits in its bar.
// (0.58 x font size per character is close enough for Inter.)
const labelWidth = (text) => text.length * LABEL_SIZE * 0.58;

export default function Barplot({ data, width }) {
  const height = MARGIN.top + data.length * ROW_HEIGHT + MARGIN.bottom;
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  // Y: one band per disease, in the order given
  const yScale = scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, innerHeight])
    .padding(0.22);

  // X: 0 at the left, rounded up to a gridline past the largest count
  const xScale = scaleLinear()
    .domain([0, max(data, (d) => d.count)])
    .range([0, innerWidth])
    .nice();

  // Gridline every 5 on wide screens, every 10 on narrow ones
  const step = innerWidth > 480 ? 5 : 10;
  const ticks = xScale.ticks().filter((t) => t % step === 0 && t > 0);

  return (
    <svg
      className="barplot"
      width={width}
      height={height}
      role="img"
      aria-label="Bar chart of laboratory-acquired infections by disease, 1970 to 2021"
    >
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        {/* Gridlines, with their values along the top */}
        {ticks.map((tick) => (
          <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
            <line className="grid" y1={-4} y2={innerHeight} />
            <text className="tick" y={-10} textAnchor="middle">
              {tick}
            </text>
          </g>
        ))}

        {/* Bars and names */}
        {data.map((d) => {
          const y = yScale(d.name);
          const barWidth = xScale(d.count);
          const text = `${d.name} (n=${d.count})`;
          const fits = labelWidth(text) + LABEL_PAD * 2 < barWidth;
          return (
            <g key={d.name} className="row">
              <rect
                className="bar"
                x={0}
                y={y}
                width={barWidth}
                height={yScale.bandwidth()}
              />
              <text
                className={fits ? "label inside" : "label outside"}
                x={fits ? LABEL_PAD : barWidth + LABEL_PAD}
                y={y + yScale.bandwidth() / 2}
                dominantBaseline="central"
                fontSize={LABEL_SIZE}
              >
                {text}
              </text>
              {/* Exact count, shown on hover */}
              <title>{`${d.name}: ${d.count} infections`}</title>
            </g>
          );
        })}

        {/* Solid baseline at zero, drawn last so it sits on top */}
        <line className="baseline" x1={0} x2={0} y1={-4} y2={innerHeight} />
        <text className="tick" x={0} y={-10} textAnchor="start">
          0
        </text>
      </g>
    </svg>
  );
}
