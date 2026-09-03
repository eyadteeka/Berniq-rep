import { getPdfJs } from "./vendors";

export function readArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`تعذّرت قراءة الملف ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * يستخرج نص PDF مرتبًا كأسطر منطقية.
 * pdf.js يعيد قصاصات نصية مبعثرة، فنعيد تجميعها حسب الإحداثي الرأسي (y)
 * ثم نرتّب كل سطر أفقيًا (x) لنحصل على السطر كما يراه القارئ.
 */
export async function extractLines(arrayBuffer) {
  const pdfjs = getPdfJs();
  const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const lines = [];

  for (let p = 1; p <= doc.numPages; p += 1) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();

    const buckets = new Map();
    content.items.forEach((item) => {
      const x = item.transform[4];
      const y = item.transform[5];
      const rowKey = Math.round(y / 2.2);
      if (!buckets.has(rowKey)) buckets.set(rowKey, []);
      buckets.get(rowKey).push({ str: item.str, x });
    });

    [...buckets.keys()]
      .sort((a, b) => b - a)
      .forEach((rowKey) => {
        const line = buckets
          .get(rowKey)
          .sort((a, b) => a.x - b.x)
          .map((i) => i.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        if (line) lines.push(line);
      });
  }

  return lines;
}

export async function extractLinesFromFile(file) {
  return extractLines(await readArrayBuffer(file));
}
