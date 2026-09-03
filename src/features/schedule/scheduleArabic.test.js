import { describe, expect, it } from "vitest";
import {
  ARABIC_PDF_FIXTURES,
  SCHEDULE_COLUMN_IDS,
  SCHEDULE_EXCEL_HEADERS,
} from "./scheduleFixtures";
import { generateSchedule, makeUnit, validateUnits } from "./scheduleEngine";

describe("Arabic PDF fixtures", () => {
  it("contains required Arabic strings for PDF rendering verification", () => {
    expect(ARABIC_PDF_FIXTURES.title).toBe("جدول دوام موظفي المطار – أغسطس 2026");
    expect(ARABIC_PDF_FIXTURES.morningPeriod).toBe("الفترة الصباحية");
    expect(ARABIC_PDF_FIXTURES.eveningPeriod).toBe("الفترة المسائية");
    expect(ARABIC_PDF_FIXTURES.employees).toEqual(["مؤيد / أيمن", "جهاد السعداوي", "إياد تكة"]);
  });

  it("defines schedule column ids in expected order", () => {
    expect(SCHEDULE_COLUMN_IDS).toEqual(["weekday", "date", "morning", "evening", "off"]);
  });

  it("exports flat Excel headers with Arabic and times", () => {
    expect(SCHEDULE_EXCEL_HEADERS[2]).toContain("الفترة الصباحية");
    expect(SCHEDULE_EXCEL_HEADERS[2]).toContain("8:00ص – 3:00م");
    expect(SCHEDULE_EXCEL_HEADERS[3]).toContain("الفترة المسائية");
  });
});

describe("schedule with Arabic employee names", () => {
  const units = [
    makeUnit("مؤيد / أيمن", "morning"),
    makeUnit("جهاد السعداوي", "evening"),
    makeUnit("إياد تكة", "off"),
  ];

  it("validates Arabic-named units", () => {
    expect(validateUnits(units)).toEqual([]);
  });

  it("preserves Arabic names in generated rows without mutation", () => {
    const { rows } = generateSchedule({ year: 2026, month: 7, units });
    const first = rows[0];

    expect(first.morning).toBe("مؤيد / أيمن");
    expect(first.evening).toBe("جهاد السعداوي");
    expect(first.off).toBe("إياد تكة");
    expect(first.date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(first.weekday).toBeTruthy();
  });
});
