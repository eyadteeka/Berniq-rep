/** خطوط عربية مطلوبة لتصدير PDF — يجب تحميلها قبل html2canvas */
export const PDF_ARABIC_FAMILIES = ["Tajawal", "Noto Sans Arabic", "Zain"];

const PDF_FONT_WEIGHTS = [400, 500, 700, 800];

/**
 * ينتظر اكتمال تحميل خطوط PDF العربية قبل التقاط DOM.
 * بدون هذا الانتظار، html2canvas قد يرسم fallback بدون Arabic shaping.
 */
export async function ensurePdfFontsReady() {
  if (typeof document === "undefined" || !document.fonts?.load) return;

  await document.fonts.ready;

  await Promise.all(
    PDF_ARABIC_FAMILIES.flatMap((family) =>
      PDF_FONT_WEIGHTS.map((weight) =>
        document.fonts.load(`${weight} 16px "${family}"`).catch(() => {}),
      ),
    ),
  );

  // إطاران لإعادة التخطيط بعد تطبيق الخطوط
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

/** يطبّق عائلة خط عربية صريحة على عنصر التصدير ونسخته */
export function applyPdfFontStack(element) {
  if (!element) return;
  const stack = '"Tajawal", "Noto Sans Arabic", sans-serif';
  element.style.fontFamily = stack;
  element.querySelectorAll("*").forEach((node) => {
    node.style.fontFamily = stack;
  });
}
