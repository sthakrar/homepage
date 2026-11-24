// Axes.jsx - reusable axis components. Each takes a D3 scale and a list of
// tick values and draws gridlines plus tick labels as plain SVG.
// They draw inside the chart's bounds group (after the margin translate).

// x axis: vertical gridlines across the plot, labels under it.
//   scale   D3 scale for x
//   ticks   values to mark
//   format  turns a value into a label
//   height  height of the plot bounds
export function AxisBottom({ scale, ticks, format, height }) {
  return (
    <g className="grid">
      {ticks.map((t) => (
        <g key={t} transform={`translate(${scale(t)}, 0)`}>
          <line y1={0} y2={height} />
          <text className="tick" y={height + 18} textAnchor="middle">
            {format(t)}
          </text>
        </g>
      ))}
      <line className="baseline" x1={0} x2={scale.range()[1]} y1={height} y2={height} />
    </g>
  );
}

// y axis: horizontal gridlines across the plot, labels to the left, and a
// rotated title beside them (the space above the plot holds the scale tags).
//   scale  D3 scale for y
//   ticks  values to mark
//   width  width of the plot bounds
//   title  axis title
export function AxisLeft({ scale, ticks, width, title }) {
  return (
    <g className="grid">
      {ticks.map((t) => (
        <g key={t} transform={`translate(0, ${scale(t)})`}>
          <line x1={0} x2={width} />
          <text className="tick" x={-8} dy="0.32em" textAnchor="end">
            {t}
          </text>
        </g>
      ))}
      <text
        className="axis-title"
        transform={`translate(-36, ${scale.range()[0] / 2}) rotate(-90)`}
        textAnchor="middle"
      >
        {title}
      </text>
    </g>
  );
}
