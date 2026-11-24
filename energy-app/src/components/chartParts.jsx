// chartParts.jsx - small pieces shared by the time charts (stacked area
// and line chart): year ticks, snapping the pointer to a year, and the
// hover tooltip.

// Decade ticks; every 20 years when the chart is narrow
export function yearTicks(x, boundsW) {
  const [from, to] = x.domain();
  const step = boundsW < 420 ? 20 : 10;
  const ticks = [];
  for (let t = Math.ceil(from / step) * step; t <= to; t += step) ticks.push(t);
  return ticks;
}

// The year nearest to a pixel position, kept within the data
export function nearestYear(x, years, px) {
  const year = Math.round(x.invert(px));
  return Math.min(years.at(-1), Math.max(years[0], year));
}

// HTML tooltip next to the hovered year; flips to the left side of the
// line when it would run off the right edge.
//   rows  [{ key, label, color, value }]
export function YearTooltip({ year, x, width, rows, footer }) {
  const flip = x > width * 0.55;
  return (
    <div
      className="tooltip"
      style={flip ? { right: width - x + 12 } : { left: x + 12 }}
      role="status"
    >
      <p className="tooltip-year">{year}</p>
      <ul>
        {rows.map((r) => (
          <li key={r.key}>
            <span className="swatch" style={{ background: r.color }} />
            <span className="tooltip-label">{r.label}</span>
            <span className="tooltip-value">{r.value}</span>
          </li>
        ))}
      </ul>
      {footer && <p className="tooltip-footer">{footer}</p>}
    </div>
  );
}
