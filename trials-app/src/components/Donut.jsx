// Donut.jsx - a donut chart, one slice per reason.
//
// D3 does only the math:
//   - pie() turns the counts into start/end angles (sort(null) keeps the
//     data order, so related reasons sit next to each other)
//   - arc() turns each pair of angles into an SVG path string
// React renders the <path> elements and the text in the middle.
import { pie, arc } from "d3";

export default function Donut({ data, size, total, active, onActive }) {
  const radius = size / 2;

  const slices = pie()
    .value((d) => d.count)
    .sort(null)(data);

  const shape = arc()
    .innerRadius(radius * 0.62)
    .outerRadius(radius)
    .padAngle(0.012)
    .cornerRadius(2);

  // The slice to grow a little: the active one, if any
  const grow = arc()
    .innerRadius(radius * 0.62)
    .outerRadius(radius + 6)
    .padAngle(0.012)
    .cornerRadius(2);

  const current = active === null ? null : data[active];

  return (
    <svg
      className="donut"
      width={size + 12}
      height={size + 12}
      viewBox={`${-radius - 6} ${-radius - 6} ${size + 12} ${size + 12}`}
      role="img"
      aria-label={`Donut chart of reasons ${total} clinical trials stopped early`}
      onMouseLeave={() => onActive(null)}
    >
      {slices.map((s, i) => (
        <path
          key={s.data.key}
          className={active !== null && active !== i ? "slice dim" : "slice"}
          d={i === active ? grow(s) : shape(s)}
          fill={s.data.color}
          onMouseEnter={() => onActive(i)}
        >
          <title>{`${s.data.reason}: ${s.data.count.toLocaleString("en-US")} trials`}</title>
        </path>
      ))}

      {/* Middle: the total, or the active slice's numbers */}
      <text className="centre-number" y={-4} textAnchor="middle">
        {(current ? current.count : total).toLocaleString("en-US")}
      </text>
      <text className="centre-label" y={radius * 0.2} textAnchor="middle">
        {current
          ? `${((current.count / total) * 100).toFixed(1)}% of trials`
          : "trials stopped early"}
      </text>
    </svg>
  );
}
