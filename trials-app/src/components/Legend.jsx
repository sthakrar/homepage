// Legend.jsx - the list beside the donut: one row per reason, grouped under
// three headings (not about the trial's data / the trial's own data / no
// reason given). Each row shows the count, its share now, and its share in
// the 2015 study for comparison. Hovering or focusing a row highlights its
// slice (App holds which one is active).
const fmt = (n) => n.toLocaleString("en-US");
const pct = (share, digits = 1) => `${(share * 100).toFixed(digits)}%`;

export default function Legend({ data, total, active, onActive }) {
  // Keep the data order, and start a new heading whenever the group changes
  const groups = [];
  data.forEach((d, i) => {
    const last = groups[groups.length - 1];
    if (!last || last.name !== d.group) groups.push({ name: d.group, rows: [] });
    groups[groups.length - 1].rows.push({ ...d, index: i });
  });

  return (
    <div className="legend" onMouseLeave={() => onActive(null)}>
      {/* Column labels */}
      <div className="legend-columns" aria-hidden="true">
        <span />
        <span />
        <span>Trials</span>
        <span>Share</span>
        <span>2015</span>
      </div>

      {groups.map((g) => {
        const groupTotal = g.rows.reduce((sum, r) => sum + r.count, 0);
        return (
          <div key={g.name} className="legend-group">
            <p className="legend-heading">
              {g.name}
              <span>
                {fmt(groupTotal)} · {pct(groupTotal / total, 0)}
              </span>
            </p>
            <ul>
              {g.rows.map((r) => (
                <li key={r.key}>
                  <button
                    type="button"
                    className={r.index === active ? "legend-row is-active" : "legend-row"}
                    title={r.detail}
                    onMouseEnter={() => onActive(r.index)}
                    onFocus={() => onActive(r.index)}
                    onBlur={() => onActive(null)}
                  >
                    <span className="swatch" style={{ background: r.color }} />
                    <span className="reason">{r.reason}</span>
                    <span className="count">{fmt(r.count)}</span>
                    <span className="pct">{pct(r.count / total)}</span>
                    <span className="then">{r.share2015 === null ? "new" : pct(r.share2015, 0)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
