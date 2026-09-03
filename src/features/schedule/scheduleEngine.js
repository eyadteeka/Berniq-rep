import { WEEKDAYS_AR, formatDate, daysInMonth } from "../../lib/format";

export const SHIFTS = {
  morning: { id: "morning", label: "صباحي", time: "8:00ص – 3:00م", offset: 0 },
  evening: { id: "evening", label: "مسائي", time: "3:00م – 9:00م", offset: 1 },
  off: { id: "off", label: "راحة", time: "OFF", offset: 2 },
};

export const SHIFT_LIST = Object.values(SHIFTS);

let unitSeq = 0;
const newId = () =>
  typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `u${(unitSeq += 1)}-${Date.now()}`;

export function makeUnit(label = "", shift = "off") {
  return { id: newId(), label, shift };
}

/**
 * تحقّق من صحة الإعداد قبل التوليد.
 * الدورة ثلاثية: صباحي → مسائي → راحة، لذا اليوم الأول يحتاج
 * وحدة صباحية واحدة ووحدة مسائية واحدة بالضبط.
 */
export function validateUnits(units) {
  const errors = [];
  if (units.length < 3) errors.push("الدورة الثلاثية تحتاج ٣ وحدات على الأقل.");
  if (units.some((u) => !u.label.trim())) errors.push("هناك وحدة بدون اسم.");

  const morning = units.filter((u) => u.shift === "morning").length;
  const evening = units.filter((u) => u.shift === "evening").length;
  if (morning !== 1) errors.push("اليوم الأول يحتاج وحدة صباحية واحدة بالضبط.");
  if (evening !== 1) errors.push("اليوم الأول يحتاج وحدة مسائية واحدة بالضبط.");

  return errors;
}

/** status = (dayIndex + offset) % 3 → 0 صباحي، 1 مسائي، 2 راحة */
export function generateSchedule({ year, month, units }) {
  const total = daysInMonth(year, month);
  const start = new Date(year, month, 1);

  const rows = Array.from({ length: total }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const slots = { morning: [], evening: [], off: [] };
    units.forEach((unit) => {
      const status = (i + SHIFTS[unit.shift].offset) % 3;
      const key = status === 0 ? "morning" : status === 1 ? "evening" : "off";
      slots[key].push(unit.label.trim());
    });

    return {
      id: formatDate(date),
      weekday: WEEKDAYS_AR[date.getDay()],
      date: formatDate(date),
      morning: slots.morning.join(" / "),
      evening: slots.evening.join(" / "),
      off: slots.off.join(" / "),
    };
  });

  const load = units.map((unit) => {
    const shifts = rows.filter(
      (r) => r.morning.includes(unit.label.trim()) || r.evening.includes(unit.label.trim()),
    ).length;
    return { label: unit.label.trim(), shifts, offDays: total - shifts };
  });

  return { rows, load, total };
}
