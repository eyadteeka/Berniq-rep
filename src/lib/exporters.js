import { getXlsx, getJsPdf, getHtml2Canvas } from "./vendors";
import { applyPdfFontStack, ensurePdfFontsReady } from "./pdfFonts";
import { money } from "./format";

/** ينشئ مصنّف Excel بعرض RTL وأعمدة مضبوطة ثم ينزّله. */
export function exportSheet({ filename, sheetName, aoa, colWidths, merges }) {
  const XLSX = getXlsx();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  if (colWidths) ws["!cols"] = colWidths.map((wch) => ({ wch }));
  if (merges) ws["!merges"] = merges;

  const wb = XLSX.utils.book_new();
  wb.Workbook = { Views: [{ RTL: true }] };
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/** ينشئ مصنّفًا من مصفوفة خام (يُستخدم لتحديث قالب التتبع السنوي). */
export function exportRawSheet({ filename, sheetName, aoa }) {
  const XLSX = getXlsx();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * يصوّر عنصر DOM ويحفظه PDF متعدّد الصفحات.
 * العربية تُرسم عبر html2canvas بعد تحميل الخطوط — لا نستخدم jsPDF.text
 * لأنها لا تدعم Arabic shaping.
 */
export async function exportElementToPdf(element, filename) {
  if (!element) throw new Error("لا يوجد محتوى للتصدير.");

  await ensurePdfFontsReady();
  applyPdfFontStack(element);

  const html2canvas = getHtml2Canvas();
  const JsPDF = getJsPdf();

  const canvas = await html2canvas(element, {
    scale: 1.5,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    onclone: (_doc, clonedEl) => {
      applyPdfFontStack(clonedEl);
    },
  });

  const pdf = new JsPDF("p", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const imgW = pageW - margin * 2;
  const imgH = (canvas.height * imgW) / canvas.width;
  const image = canvas.toDataURL("image/png");

  let remaining = imgH;
  let offset = margin;

  pdf.addImage(image, "PNG", margin, offset, imgW, imgH);
  remaining -= pageH - margin * 2;

  while (remaining > 0) {
    offset = margin - (imgH - remaining);
    pdf.addPage();
    pdf.addImage(image, "PNG", margin, offset, imgW, imgH);
    remaining -= pageH - margin * 2;
  }

  pdf.save(`${filename}.pdf`);
}

export const asMoneyRow = (values) => values.map((v) => money(v));
