// ImagingCard.jsx - one card for one imaging technique.
import { imageUrl, creditUrl, licenseUrl } from "../data/imaging.js";

// null → "Varies", 0 → "None", otherwise e.g. "0.1 mSv"
const formatDose = (msv) =>
  msv === null ? "Varies" : msv === 0 ? "None" : `${msv} mSv`;

// Typical times are approximate: "~45 min", and long ones in hours ("~8 h")
const formatTime = (minutes) =>
  minutes >= 120 ? `~${minutes / 60} h` : `~${minutes} min`;

export default function ImagingCard({ scan }) {
  return (
    <article className="scan-card">
      <div className={scan.invert ? "scan-image invert" : "scan-image"}>
        <img
          src={imageUrl(scan.file)}
          alt={scan.name}
          loading="lazy"
          style={{
            objectPosition: scan.focus ?? "50% 50%",
            transform: scan.zoom ? `scale(${scan.zoom})` : undefined,
            transformOrigin: scan.focus ?? "50% 50%",
          }}
        />
      </div>

      <div className="scan-body">
        <span className="tag">{scan.type}</span>
        <h2>{scan.name}</h2>
        <p className="shows">{scan.shows}</p>

        <dl className="stats">
          <div>
            <dt>Radiation</dt>
            <dd>{formatDose(scan.radiationMsv)}</dd>
          </div>
          <div>
            <dt>Like background</dt>
            <dd>{["none", "varies"].includes(scan.likeBackground) ? "-" : scan.likeBackground}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{formatTime(scan.minutes)}</dd>
          </div>
        </dl>

        {/* Credit: author (links to the image's Commons page) and licence */}
        <p className="credit">
          Image:{" "}
          <a href={creditUrl(scan.file)} target="_blank" rel="noopener">
            {scan.author}
          </a>
          {" · "}
          {licenseUrl(scan.license) ? (
            <a href={licenseUrl(scan.license)} target="_blank" rel="noopener">
              {scan.license}
            </a>
          ) : (
            scan.license
          )}
        </p>
      </div>
    </article>
  );
}
