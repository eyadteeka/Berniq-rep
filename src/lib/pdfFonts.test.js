import { describe, expect, it, vi } from "vitest";
import { applyPdfFontStack, ensurePdfFontsReady, PDF_ARABIC_FAMILIES } from "./pdfFonts";

describe("ensurePdfFontsReady", () => {
  it("loads all configured Arabic font families", async () => {
    const loads = [];
    const fonts = {
      ready: Promise.resolve(),
      load: vi.fn((spec) => {
        loads.push(spec);
        return Promise.resolve({});
      }),
    };

    const raf = vi.fn((cb) => {
      cb();
      return 0;
    });

    vi.stubGlobal("document", { fonts });
    vi.stubGlobal("requestAnimationFrame", raf);

    await ensurePdfFontsReady();

    expect(fonts.load).toHaveBeenCalled();
    for (const family of PDF_ARABIC_FAMILIES) {
      expect(loads.some((spec) => spec.includes(`"${family}"`))).toBe(true);
    }

    vi.unstubAllGlobals();
  });
});

describe("applyPdfFontStack", () => {
  it("applies Arabic font stack to element and descendants", () => {
    const child = document.createElement("span");
    const root = document.createElement("div");
    root.appendChild(child);

    applyPdfFontStack(root);

    const stack = '"Tajawal", "Noto Sans Arabic", sans-serif';
    expect(root.style.fontFamily).toBe(stack);
    expect(child.style.fontFamily).toBe(stack);
  });
});
