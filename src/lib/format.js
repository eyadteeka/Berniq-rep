export const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export const MONTH_KEYS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

export const WEEKDAYS_AR = [
  "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت",
];

export const pad2 = (n) => String(n).padStart(2, "0");

/** يحوّل أي قيمة إلى رقم آمن (يتجاهل الفواصل الألفية). */
export function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const n = parseFloat(String(value).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

/** 1234.5 → "1,234.50" */
export function money(n) {
  return toNumber(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function percent(n) {
  return `${(toNumber(n) * 100).toFixed(2)}%`;
}

/** "04/07/2026" → { display, key } — key رقم قابل للفرز */
export function parseDayKey(text) {
  const m = String(text).trim().match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (!m) return null;
  let [, dd, mm, yy] = m;
  if (yy.length === 2) yy = `20${yy}`;
  return {
    display: `${pad2(+dd)}/${pad2(+mm)}/${yy}`,
    key: +yy * 10000 + +mm * 100 + +dd,
  };
}

export function formatDate(date) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function downloadName(base, ext) {
  return `${base}.${ext}`;
}
