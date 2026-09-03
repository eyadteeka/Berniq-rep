import { LtrText } from "../../components/ui/Bidi";
import { ARABIC_PDF_FIXTURES, SCHEDULE_SHIFT_TIMES } from "./scheduleFixtures";

export { ARABIC_PDF_FIXTURES, SCHEDULE_EXCEL_HEADERS, SCHEDULE_SHIFT_TIMES } from "./scheduleFixtures";

/** أعمدة جدول الدوام — رؤوس عربية مع أوقات LTR معزولة */
export const SCHEDULE_COLUMNS = [
  { id: "weekday", header: ARABIC_PDF_FIXTURES.weekday },
  { id: "date", header: ARABIC_PDF_FIXTURES.date, kind: "raw", cellBidi: "ltr" },
  {
    id: "morning",
    header: (
      <>
        {ARABIC_PDF_FIXTURES.morningPeriod}
        <br />
        <LtrText className="b-table__time">{SCHEDULE_SHIFT_TIMES.morning}</LtrText>
      </>
    ),
    strong: true,
  },
  {
    id: "evening",
    header: (
      <>
        {ARABIC_PDF_FIXTURES.eveningPeriod}
        <br />
        <LtrText className="b-table__time">{SCHEDULE_SHIFT_TIMES.evening}</LtrText>
      </>
    ),
    strong: true,
  },
  { id: "off", header: ARABIC_PDF_FIXTURES.off },
];
