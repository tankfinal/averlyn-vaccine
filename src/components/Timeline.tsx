import type { Vaccine } from "../types";
import {
  filterVaccines,
  findNextVaccine,
  getVaccineDate,
  type FilterType,
} from "../utils/vaccine";
import { formatDate } from "../utils/date";
import { VaccineCard } from "./VaccineCard";

interface TimelineProps {
  vaccines: Vaccine[];
  currentFilter: FilterType;
}

export function Timeline({ vaccines, currentFilter }: TimelineProps) {
  const filtered = filterVaccines(vaccines, currentFilter);
  const nextVaccine = findNextVaccine(vaccines);

  // Split into dated and undated
  const dated = filtered.filter((v) => getVaccineDate(v) !== null);
  const undated = filtered.filter((v) => getVaccineDate(v) === null);

  // Sort by date
  dated.sort(
    (a, b) =>
      new Date(getVaccineDate(a)!).getTime() -
      new Date(getVaccineDate(b)!).getTime()
  );

  // Group by date
  const groups = new Map<string, Vaccine[]>();
  for (const v of dated) {
    const key = getVaccineDate(v)!;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }

  if (filtered.length === 0) {
    return (
      <div className="timeline">
        <p
          style={{
            textAlign: "center",
            color: "#9e9e9e",
            padding: "40px 0",
          }}
        >
          {"\u6C92\u6709\u7B26\u5408\u689D\u4EF6\u7684\u75AB\u82D7"}
        </p>
      </div>
    );
  }

  return (
    <div className="timeline">
      {Array.from(groups.entries()).map(([dateKey, items]) => (
        <div className="age-group" key={dateKey}>
          <div className="age-group-label">{formatDate(dateKey)}</div>
          {items.map((v) => (
            <VaccineCard
              key={v.id}
              vaccine={v}
              isNext={nextVaccine?.id === v.id}
            />
          ))}
        </div>
      ))}
      {undated.length > 0 && (
        <div className="age-group">
          <div className="age-group-label">
            {"\u5C1A\u672A\u6392\u5B9A"}
          </div>
          {undated.map((v) => (
            <VaccineCard key={v.id} vaccine={v} isNext={false} />
          ))}
        </div>
      )}
    </div>
  );
}
