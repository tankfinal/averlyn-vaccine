import { useState } from "react";
import type { Vaccine } from "../types";
import { getStatus, getDaysUntilText, wasEdited } from "../utils/vaccine";
import { formatDate, formatPrice, formatDateTime } from "../utils/date";

interface VaccineCardProps {
  vaccine: Vaccine;
  isNext: boolean;
}

export function VaccineCard({ vaccine, isNext }: VaccineCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = getStatus(vaccine);
  const daysUntil = getDaysUntilText(vaccine);

  let dateStr: string;
  if (vaccine.done && vaccine.done_date) {
    dateStr = `\u65BD\u6253\u65E5\u671F: ${formatDate(vaccine.done_date)}`;
  } else if (vaccine.scheduled_date) {
    dateStr = `\u9810\u8A08\u65E5\u671F: ${formatDate(vaccine.scheduled_date)}`;
  } else {
    dateStr = "\u5C1A\u672A\u6392\u5B9A\u65E5\u671F\uFF08\u53EF\u8AEE\u8A62\u91AB\u5E2B\uFF09";
  }

  const statusBadge = (() => {
    switch (status) {
      case "done":
        return <span className="badge badge-done">{"\u2713 \u5DF2\u5B8C\u6210"}</span>;
      case "overdue":
        return <span className="badge badge-overdue">{"\u26A0 \u903E\u671F"}</span>;
      case "optional":
        return <span className="badge badge-optional">{"\u25CF \u53EF\u9078"}</span>;
      default:
        return <span className="badge badge-upcoming">{"\u25CB \u5F85\u65BD\u6253"}</span>;
    }
  })();

  const typeBadge =
    vaccine.type === "public" ? (
      <span className="badge badge-public">{"\u516C\u8CBB"}</span>
    ) : (
      <span className="badge badge-self">{"\u81EA\u8CBB"}</span>
    );

  const priceBadge =
    vaccine.price != null ? (
      <span className="badge badge-price">${formatPrice(vaccine.price)}</span>
    ) : null;

  const handleCardClick = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className={`vaccine-card ${status}${isNext ? " next-up" : ""}${expanded ? " expanded" : ""}`}
      onClick={handleCardClick}
    >
      {isNext && <span className="next-label">NEXT UP</span>}
      <div className="vaccine-card-header">
        <div className="vaccine-card-left">
          <div className="vaccine-name">{vaccine.name}</div>
          <div className="vaccine-name-en">{vaccine.name_en}</div>
          {vaccine.subtitle && (
            <div className="vaccine-subtitle">{vaccine.subtitle}</div>
          )}
          <div className="vaccine-date">
            {dateStr}
            {daysUntil && ` ${daysUntil}`}
          </div>
          {wasEdited(vaccine) && (
            <div className="vaccine-updated">
              {`\u6700\u5F8C\u66F4\u65B0: ${formatDateTime(vaccine.updated_at)}`}
            </div>
          )}
        </div>
        <div className="vaccine-badges">
          {statusBadge}
          {typeBadge}
          {priceBadge}
        </div>
      </div>
      <div className="vaccine-detail">
        <p>{vaccine.description}</p>
        {vaccine.side_effects && (
          <div className="detail-section">
            <strong>{"\u526F\u4F5C\u7528"}</strong>
            <p>{vaccine.side_effects}</p>
          </div>
        )}
        {vaccine.notes && (
          <div className="detail-section">
            <strong>{"\u6CE8\u610F\u4E8B\u9805"}</strong>
            <p>{vaccine.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
