/** نصوص اختبارية للتحقق من Arabic shaping في PDF */
export const ARABIC_PDF_FIXTURES = {
  title: "جدول دوام موظفي المطار – أغسطس 2026",
  morningPeriod: "الفترة الصباحية",
  eveningPeriod: "الفترة المسائية",
  weekday: "اليوم",
  date: "التاريخ",
  off: "راحة",
  employees: ["مؤيد / أيمن", "جهاد السعداوي", "إياد تكة"],
  morningTime: "8:00ص – 3:00م",
  eveningTime: "3:00م – 9:00م",
};

export const SCHEDULE_SHIFT_TIMES = {
  morning: ARABIC_PDF_FIXTURES.morningTime,
  evening: ARABIC_PDF_FIXTURES.eveningTime,
};

/** صف Excel — نصوص مسطّحة بدون JSX */
export const SCHEDULE_EXCEL_HEADERS = [
  ARABIC_PDF_FIXTURES.weekday,
  ARABIC_PDF_FIXTURES.date,
  `${ARABIC_PDF_FIXTURES.morningPeriod} (${SCHEDULE_SHIFT_TIMES.morning})`,
  `${ARABIC_PDF_FIXTURES.eveningPeriod} (${SCHEDULE_SHIFT_TIMES.evening})`,
  ARABIC_PDF_FIXTURES.off,
];

/** معرّفات أعمدة جدول الدوام */
export const SCHEDULE_COLUMN_IDS = ["weekday", "date", "morning", "evening", "off"];
