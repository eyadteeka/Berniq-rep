import { getXlsx } from "../../lib/vendors";
import { readArrayBuffer } from "../../lib/pdfText";
import { MONTH_KEYS, toNumber } from "../../lib/format";

/** يقرأ قالب التتبع السنوي ويكتشف مواضع الأعمدة بدل افتراضها. */
export async function readAnnualTemplate(file) {
  const XLSX = getXlsx();
  const buffer = await readArrayBuffer(file);
  const wb = XLSX.read(buffer, { type: "array" });
  const sheetName = wb.SheetNames[0];
  const aoa = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, raw: true });

  const headerRow = aoa.findIndex((row) =>
    (row ?? []).some((cell) =>
      String(cell ?? "").toLowerCase().replace(/\s/g, "").includes("sinecode"),
    ),
  );
  if (headerRow === -1) {
    throw new Error('لم يُعثر على عمود "Sine Code" في الورقة الأولى من القالب.');
  }

  const header = aoa[headerRow];
  const monthCols = Array(12).fill(-1);
  let codeCol = -1;
  let totalCol = -1;
  let percentCol = -1;

  header.forEach((cell, i) => {
    const key = String(cell ?? "").trim().toUpperCase().replace(/\s/g, "");
    if (key === "SINECODE") codeCol = i;
    else if (key === "TOTAL") totalCol = i;
    else if (key === "%") percentCol = i;
    else {
      const mi = MONTH_KEYS.indexOf(key);
      if (mi > -1) monthCols[mi] = i;
    }
  });

  if (monthCols.some((c) => c === -1)) {
    throw new Error("القالب لا يحتوي على اثني عشر عمودًا للأشهر (JAN…DEC).");
  }

  const employees = [];
  for (let r = headerRow + 1; r < aoa.length; r += 1) {
    const row = aoa[r] ?? [];
    const code = String(row[codeCol] ?? "").trim();
    if (!code) break;
    employees.push({ row: r, code, name: String(row[0] ?? "").trim() || code });
  }

  return {
    sheetName,
    aoa,
    headerRow,
    nameCol: 0,
    codeCol,
    totalCol,
    percentCol,
    monthCols,
    employees,
  };
}

/** يكتب إجمالي الشهر لكل موظف مطابق، ثم يعيد حساب TOTAL و%. */
export function applyMonthTotals({ template, monthIndex, entries }) {
  const aoa = template.aoa.map((row) => (row ? [...row] : []));
  const monthCol = template.monthCols[monthIndex];

  const matched = [];
  const unmatched = [];

  entries.forEach((entry) => {
    const target = template.employees.find(
      (e) => e.code.toLowerCase() === String(entry.code).trim().toLowerCase(),
    );
    if (!target) {
      unmatched.push(entry);
      return;
    }
    aoa[target.row][monthCol] = Math.round(entry.total * 100) / 100;
    matched.push({ ...entry, name: target.name, row: target.row });
  });

  let grand = 0;
  const sums = template.employees.map((e) => {
    const sum = template.monthCols.reduce((acc, c) => acc + toNumber(aoa[e.row][c]), 0);
    grand += sum;
    return { ...e, sum };
  });

  sums.forEach((e) => {
    if (template.totalCol > -1) aoa[e.row][template.totalCol] = Math.round(e.sum * 100) / 100;
    if (template.percentCol > -1) {
      aoa[e.row][template.percentCol] = grand > 0 ? Math.round((e.sum / grand) * 10000) / 10000 : 0;
    }
  });

  const preview = sums.map((e) => ({
    code: e.code,
    name: e.name,
    month: toNumber(aoa[e.row][monthCol]),
    total: e.sum,
    share: grand > 0 ? e.sum / grand : 0,
    updated: matched.some((m) => m.row === e.row),
  }));

  return { aoa, preview, matched, unmatched, grand };
}
