// FilterBar.jsx - a row of pill buttons, one per imaging type.
// It doesn't hold any state itself: App passes in what's selected and a
// function to call when a pill is clicked.
import SourcesInfo from "./SourcesInfo.jsx";

export default function FilterBar({ types, selected, onSelect, shown, total }) {
  return (
    <div className="filter-bar">
      <div className="pills" role="group" aria-label="Filter by type">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            className="pill"
            aria-pressed={type === selected}
            onClick={() => onSelect(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="count-row">
        <p className="count" aria-live="polite">
          Showing {shown} of {total}
        </p>
        <SourcesInfo />
      </div>
    </div>
  );
}
