// Barplot.jsx - a horizontal bar chart recreating The Economist's
// "Escape artists" chart: gridlines every 5 with their values along the
// top, a black baseline at zero, and each name written inside its bar in
// white (or just outside in the bar colour, if the bar is too short).
//
// D3 does only the math (scaleBand, scaleLinear). React renders the SVG.
import { scaleBand, scaleLinear } from "d3";

const MARGIN = { top: 30, right: 14, bottom: 4, left: 0 };
const ROW_HEIGHT = 41;    // vertical space per bar (bar + gap), as in the original
const LABEL_SIZE = 15;    // font size of the names, in px
const LABEL_PAD = 7;      // gap between a bar's start (or end) and its name

// Rough width of a name in pixels, to decide whether it fits in its bar.
// (0.56 x font size per character is close enough for Roboto.)
const labelWidth = (text) => text.length * LABEL_SIZE * 0.56;

export default function Barplot({ data, width }) {
  const height = MARGIN.top + data.length * ROW_HEIGHT + MARGIN.bottom;
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  // Y: one band per disease, in the order given. Bars fill about 62% of
  // each row, like the original.
  const yScale = scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, innerHeight])
    .paddingInner(0.38)
    .paddingOuter(0.1);

  // X: 0 to 55, as in the original
  const xScale = scaleLinear().domain([0, 55]).range([0, innerWidth]);

  // Gridline every 5 on wide screens, every 10 on narrow ones (so the
  // numbers along the top don't collide)
  const step = innerWidth > 420 ? 5 : 10;
  const ticks = xScale.ticks(11).filter((t) => t % step === 0);

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
            {tick > 0 && <line className="grid" y1={-6} y2={innerHeight} />}
            <text className="tick" y={-12} textAnchor="middle">
              {tick}
            </text>
          </g>
        ))}

        {/* Bars and names */}
        {data.map((d) => {
          const y = yScale(d.name);
          const barWidth = xScale(d.count);
          // Inside only with room to spare, as in the original (where Ebola's
          // name sits inside its bar but Dengue's, one bar shorter, does not)
          const fits = labelWidth(d.name) + 40 < barWidth;
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
                {d.name}
              </text>
              {/* Exact count, shown on hover */}
              <title>{`${d.name}: ${d.count} infections`}</title>
            </g>
          );
        })}

        {/* Black baseline at zero, drawn last so it sits on top */}
        <line className="baseline" x1={0} x2={0} y1={-6} y2={innerHeight} />
      </g>
    </svg>
  );
}
