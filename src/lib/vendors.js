/**
 * جسر إلى مكتبات الطرف الثالث المحمّلة عبر <script> في index.html.
 * لا نحزمها مع التطبيق حتى يبقى ملف البناء صالحًا للفتح مباشرة من القرص،
 * ويعمل عامل pdf.js دون قيود بروتوكول file://.
 */

const MISSING = (name) =>
  new Error(`مكتبة ${name} لم تُحمّل. تأكد من اتصال الإنترنت ثم أعد تحميل الصفحة.`);

export function getPdfJs() {
  const lib = typeof window !== "undefined" ? window.pdfjsLib : null;
  if (!lib) throw MISSING("pdf.js");
  return lib;
}

export function getXlsx() {
  const lib = typeof window !== "undefined" ? window.XLSX : null;
  if (!lib) throw MISSING("SheetJS");
  return lib;
}

export function getJsPdf() {
  const ns = typeof window !== "undefined" ? window.jspdf : null;
  if (!ns?.jsPDF) throw MISSING("jsPDF");
  return ns.jsPDF;
}

export function getHtml2Canvas() {
  const lib = typeof window !== "undefined" ? window.html2canvas : null;
  if (!lib) throw MISSING("html2canvas");
  return lib;
}

/** هل كل المكتبات جاهزة؟ تُستخدم لعرض حالة "غير متصل". */
export function vendorsReady() {
  if (typeof window === "undefined") return false;
  return Boolean(window.pdfjsLib && window.XLSX && window.jspdf && window.html2canvas);
}
