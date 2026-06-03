import { baby } from "../data/baby";
import { formatAge, formatDate } from "../utils/date";

const LAST_UPDATED = "2026-06-03";

export function Header() {
  const birthDate = new Date(baby.birth_date);

  return (
    <header className="header">
      <div className="baby-name">{baby.name}</div>
      <div className="baby-subtitle">Vaccine Tracker</div>
      <div className="baby-info">
        <span className="info-pill">
          <span className="info-icon">{"📅"}</span>
          {formatDate(baby.birth_date)}
        </span>
        <span className="info-pill">
          <span className="info-icon">{"👶"}</span>
          <span id="ageDisplay">{formatAge(birthDate)}</span>
        </span>
      </div>
      <div className="last-updated">
        {`最後更新: ${formatDate(LAST_UPDATED)}`}
      </div>
    </header>
  );
}
