import { extractLinesFromFile } from "./pdfText";
import { toNumber, parseDayKey } from "./format";

/* ------------------------------------------------------------------ *
 * 1) Videcom — "Sales Report by Agent + FOP"                          *
 *    سطر معاملة: DateOfIssue Time RLOC FltNo Route Status Curr Comm   *
 *                NetFare [FOP]                                        *
 *    سطر مجموع : 01/01/1900 Total MMM 0 6085.95                       *
 *    ملاحظة    : عمود FOP لا يظهر في كل التصديرات — نتعامل مع غيابه.  *
 * ------------------------------------------------------------------ */

const FOP_CODES = ["MMM", "MMR", "QQQ"];

export const FOP_LABEL = {
  MMM: "كاش",
  QQQ: "مصرفي / صك",
  MMR: "مسترجع",
};

export function parseAgentFopLines(lines) {
  const idLine = lines.find((l) => /AgentID/i.test(l));
  const agentId = idLine?.match(/AgentID:?\s*(\S+)/i)?.[1] ?? null;

  const rangeLine = lines.find((l) => /Range from/i.test(l));
  const range = rangeLine?.replace(/^.*Range from:\s*/i, "").trim() ?? null;

  const totals = { MMM: 0, MMR: 0, QQQ: 0, GRAND: 0 };
  const days = new Map();
  let hasPerRowFop = false;
  let sawGrand = false;

  lines.forEach((line) => {
    const t = line.split(/\s+/);

    if (t[0] === "01/01/1900" && t[1] === "Total") {
      if (FOP_CODES.includes(t[2])) {
        totals[t[2]] = toNumber(t[t.length - 1]);
      } else {
        totals.GRAND = toNumber(t[t.length - 1]);
        sawGrand = true;
      }
      return;
    }

    const isTxn =
      /^\d{2}\/\d{2}\/\d{4}$/.test(t[0]) && /^\d{2}:\d{2}:\d{2}$/.test(t[1]);
    if (!isTxn) return;

    // بعض التصديرات تُلحق PayRef و MobAccNo بعد عمود FOP، فلا يصحّ افتراض
    // أن آخر عمود هو FOP. نبحث عن الرمز بموضعه، وNetFare هو الرقم الذي يسبقه.
    // وإن غاب FOP تمامًا فالمبلغ هو آخر رقم في السطر.
    const fopAt = t.findIndex((tok, i) => i >= 7 && FOP_CODES.includes(String(tok).toUpperCase()));
    const fop = fopAt > -1 ? String(t[fopAt]).toUpperCase() : null;
    if (fop) hasPerRowFop = true;

    const amountToken = fop ? t[fopAt - 1] : t[t.length - 1];
    if (!/^-?\d+(\.\d+)?$/.test(String(amountToken))) return;

    const amount = toNumber(amountToken);
    const day = parseDayKey(t[0]);
    if (!day) return;

    if (!days.has(day.key)) {
      days.set(day.key, { key: day.key, date: day.display, MMM: 0, MMR: 0, QQQ: 0, total: 0 });
    }
    const bucket = days.get(day.key);
    if (fop) bucket[fop] += amount;
    bucket.total += amount;
  });

  if (!sawGrand) totals.GRAND = totals.MMM + totals.MMR + totals.QQQ;

  return {
    agentId,
    range,
    totals,
    hasPerRowFop,
    days: [...days.values()].sort((a, b) => a.key - b.key),
  };
}

export async function parseAgentFopFile(file) {
  const lines = await extractLinesFromFile(file);
  const result = parseAgentFopLines(lines);
  if (!result.days.length && !result.totals.GRAND) {
    throw new Error(
      `${file.name}: لم يُعثر على معاملات — تأكد أنه تصدير "Sales Report by Agent + FOP".`,
    );
  }
  return result;
}

export const PAYMENT_COLUMNS = [
  { id: "cash", label: "كاش", token: "--pay-cash" },
  { id: "check", label: "صك", token: "--pay-check" },
  { id: "wps", label: "وابس", token: "--pay-wps" },
  { id: "other", label: "ادفعلي", token: "--pay-other" },
];

/* ------------------------------------------------------------------ *
 * 3) بناء تقرير المبيعات الفعلية من ملفات الموظفين (Videcom)          *
 *    يجمع القيم اليومية لكل الموظفين في جدول واحد بصيغة القالب.       *
 * ------------------------------------------------------------------ */

export function aggregateAgents(agentResults) {
  const days = new Map();

  agentResults.forEach((agent) => {
    agent.days.forEach((d) => {
      if (!days.has(d.key)) {
        days.set(d.key, {
          key: d.key,
          date: d.date,
          cash: 0,
          check: 0,
          wps: 0,
          other: 0,
          total: 0,
        });
      }
      const row = days.get(d.key);
      row.cash += d.MMM;
      row.check += d.QQQ + d.MMR;
      row.total += d.total;
    });
  });

  const rows = [...days.values()].sort((a, b) => a.key - b.key);
  const totals = rows.reduce(
    (acc, r) => ({
      cash: acc.cash + r.cash,
      check: acc.check + r.check,
      wps: acc.wps + r.wps,
      other: acc.other + r.other,
      total: acc.total + r.total,
    }),
    { cash: 0, check: 0, wps: 0, other: 0, total: 0 },
  );

  // التقرير الخالي من عمود FOP يدخل في المجموع اليومي لكنه لا يُنسب إلى
  // كاش أو مصرفي، فنُبلّغ عنه صراحةً بدل ترك فرق صامت في الأعمدة.
  const missingFop = agentResults
    .filter((a) => !a.hasPerRowFop)
    .map((a) => a.agentId ?? "غير معروف");

  return {
    rows,
    totals,
    missingFop,
    resolvedPaymentSplit: missingFop.length === 0,
  };
}
