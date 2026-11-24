// Controls.jsx - the inputs in the cards' top-right corners. They all read
// and write the dashboard's shared state, so changing one updates every card.
import { useId } from "react";
import { COUNTRIES, FIRST_YEAR, LAST_YEAR } from "../data/sources.js";

// Country picker. Years the country has no data for are noted in the name.
export function CountrySelect({ value, onChange }) {
  const id = useId();
  return (
    <label className="control" htmlFor={id}>
      <span className="control-label">Country</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {c === "Russia" ? "Russia (from 1985)" : c}
          </option>
        ))}
      </select>
    </label>
  );
}

// Year slider with the year shown beside it
export function YearSlider({ value, onChange, min = FIRST_YEAR }) {
  const id = useId();
  return (
    <label className="control" htmlFor={id}>
      <span className="control-label">Year</span>
      <span className="year-input">
        <input
          id={id}
          type="range"
          min={min}
          max={LAST_YEAR}
          step={1}
          value={Math.max(min, value)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <output htmlFor={id}>{Math.max(min, value)}</output>
      </span>
    </label>
  );
}

// Two-option toggle (e.g. TWh / Share)
export function Toggle({ options, value, onChange, label }) {
  return (
    <div className="control">
      <span className="control-label">{label}</span>
      <div className="segmented" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
