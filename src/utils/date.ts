const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export function getToday(): Date {
  return TODAY;
}

export function monthsDiff(from: Date, to: Date): number {
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  const days = to.getDate() - from.getDate();
  let total = years * 12 + months;
  if (days < 0) total--;
  return Math.max(0, total);
}

export function daysDiff(from: Date, to: Date): number {
  const msPerDay = 86400000;
  return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

export function formatAge(birthDate: Date): string {
  const months = monthsDiff(birthDate, TODAY);
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years > 0) {
    return rem > 0 ? `${years} \u6B72 ${rem} \u500B\u6708` : `${years} \u6B72`;
  }
  return `${months} \u500B\u6708`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("zh-TW");
}

export function formatDateTime(isoStr: string): string {
  const d = new Date(isoStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}
