import { useMemo, useRef, useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardHead, CardActions } from "../../components/ui/Card";
import { Field, Select, FieldRow } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import DataTable from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import UnitRow from "./UnitRow";
import { IconPlus, IconDownload, IconRoster, IconCheck } from "../../components/ui/Icons";
import { generateSchedule, makeUnit, validateUnits } from "./scheduleEngine";
import { SCHEDULE_COLUMNS, SCHEDULE_EXCEL_HEADERS } from "./scheduleColumns";
import { exportSheet, exportElementToPdf } from "../../lib/exporters";
import { MONTHS_AR, daysInMonth } from "../../lib/format";
import { ArabicText, LtrText } from "../../components/ui/Bidi";
import { getTool } from "../../data/tools";
import textLogo from "../../assets/text-logo.jpeg";
import Tabs from "./Tabs";
import EmployeeManager from "./EmployeeManager";
import OfficeManager from "./OfficeManager";
import { useEmployees, useOffices } from "./useScheduleData";
import "./SchedulePage.css";

const tool = getTool("schedule");
const now = new Date();

export default function SchedulePage() {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [units, setUnits] = useState(() => [
    makeUnit("", "morning"),
    makeUnit("", "evening"),
    makeUnit("", "off"),
  ]);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [tableTitle, setTableTitle] = useState("sales");
  const [customTitle, setCustomTitle] = useState("");
  const [activeTab, setActiveTab] = useState("schedule");
  const printRef = useRef(null);

  // استدعاء الـ hooks للموظفين والمكاتب
  const { employees, add: addEmployee, update: updateEmployee, remove: removeEmployee } = useEmployees();
  const { offices, add: addOffice, update: updateOffice, remove: removeOffice } = useOffices();

  const monthLabel = `${MONTHS_AR[month]} ${year}`;
  const dayCount = useMemo(() => daysInMonth(year, month), [year, month]);

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = now.getFullYear() - 1 + i;
    return { value: y, label: String(y) };
  });

  const getTitleOptions = () => {
    const officeOptions = offices.map((office) => ({
      value: `office_${office.id}`,
      label: `جدول دوام موظفين ${office.name}`,
    }));

    return [ ...officeOptions, { value: "custom", label: "تخصيص الاسم" }];
  };

  const getTitleText = () => {
    if (tableTitle === "sales") {
      return "جدول دوام موظفين مكتب مبيعات مطار مصراته";
    } else if (tableTitle === "airport") {
      return "جدول دوام موظفين مكتب مطار مصراته";
    } else if (tableTitle.startsWith("office_")) {
      const officeId = parseInt(tableTitle.split("_")[1]);
      const office = offices.find((o) => o.id === officeId);
      return office ? `جدول دوام موظفين ${office.name}` : customTitle;
    } else {
      return customTitle;
    }
  };

  const build = () => {
    const found = validateUnits(units);
    setErrors(found);
    if (found.length) {
      setResult(null);
      return;
    }
    setResult(generateSchedule({ year, month, units }));
  };

  const rows = result?.rows ?? [];

  const toExcel = () => {
    exportSheet({
      filename: `جدول_دوام_${MONTHS_AR[month]}_${year}`,
      sheetName: "الدوام",
      colWidths: [12, 12, 28, 28, 24],
      merges: [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }],
      aoa: [
        [`${getTitleText()} — ${monthLabel}`],
        SCHEDULE_EXCEL_HEADERS,
        ...rows.map((r) => [r.weekday, r.date, r.morning, r.evening, r.off]),
      ],
    });
  };

  const toPdf = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await exportElementToPdf(printRef.current, `جدول_دوام_${MONTHS_AR[month]}_${year}`);
    } catch (err) {
      setExportError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const scheduleContent = (
    <div className="b-sched__tabs-content">
      <Card>
        <CardHead step="0" title="عنوان الجدول" />
        <FieldRow>
          <Field label="اختر عنوان الجدول">
            {(id) => (
              <Select
                id={id}
                value={tableTitle}
                onChange={(e) => {
                  setTableTitle(e.target.value);
                  if (e.target.value !== "custom" && !e.target.value.startsWith("office_")) {
                    setCustomTitle("");
                  }
                }}
                options={getTitleOptions()}
              />
            )}
          </Field>
        </FieldRow>
        {tableTitle === "custom" && (
          <FieldRow>
            <Field label="أدخل العنوان المخصص">
              {(id) => (
                <input
                  id={id}
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="أدخل عنوان الجدول"
                  className="b-field__input"
                />
              )}
            </Field>
          </FieldRow>
        )}
      </Card>

      <Card>
        <CardHead step="2" title="الشهر" hint={`${dayCount} يومًا في ${monthLabel}.`} />
        <FieldRow>
          <Field label="الشهر">
            {(id) => (
              <Select
                id={id}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                options={MONTHS_AR.map((m, i) => ({ value: i, label: m }))}
              />
            )}
          </Field>
          <Field label="السنة">
            {(id) => (
              <Select
                id={id}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                options={yearOptions}
              />
            )}
          </Field>
        </FieldRow>
      </Card>

      <Card>
        <CardHead
          step="3"
          title="الموظفون"
          hint="الوحدة قد تكون موظفًا واحدًا أو أكثر يتناوبون معًا — افصل الأسماء بـ « / »."
        />

        <div>
          {units.map((unit, i) => (
            <UnitRow
              key={unit.id}
              unit={unit}
              index={i}
              canRemove={units.length > 3}
              employees={employees}
              onChange={(next) => setUnits(units.map((u) => (u.id === next.id ? next : u)))}
              onRemove={() => setUnits(units.filter((u) => u.id !== unit.id))}
            />
          ))}
        </div>

        <Button variant="secondary" size="sm" icon={IconPlus} onClick={() => setUnits([...units, makeUnit()])}>
          إضافة وحدة
        </Button>

        {errors.length > 0 && (
          <Alert tone="error" title="راجع الإعداد قبل التوليد">
            <ul className="b-sched__errors">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Alert>
        )}

        <CardActions>
          <Button icon={IconRoster} onClick={build}>
            توليد الجدول
          </Button>
        </CardActions>
      </Card>

      {!result ? (
        <EmptyState icon={IconRoster} title="لا يوجد جدول بعد">
          عبّئ الوحدات أعلاه ثم اضغط «توليد الجدول» — يظهر الشهر كاملًا هنا فورًا.
        </EmptyState>
      ) : (
        <Card>
          <CardHead
            title={`جدول ${monthLabel}`}
            aside={
              <span className="b-sched__ok">
                <IconCheck size={15} /> {result.total} يومًا
              </span>
            }
          />

          <div className="b-sched__load">
            {result.load.map((u) => (
              <div className="b-sched__loadItem" key={u.label}>
                <span className="b-sched__loadName">{u.label}</span>
                <span className="b-sched__loadValue num">{u.shifts}</span>
                <span className="b-sched__loadUnit">نوبة</span>
              </div>
            ))}
          </div>

          <div ref={printRef} className="b-sched__print" lang="ar" dir="rtl">
            <div className="b-sched__hero">
              <img src={textLogo} alt="شعار الشركة" className="b-sched__logo" />
            </div>
            <ArabicText as="h3" className="b-sched__printTitle">
              {getTitleText()} — {MONTHS_AR[month]}{" "}
              <LtrText>{year}</LtrText>
            </ArabicText>
            <DataTable columns={SCHEDULE_COLUMNS} rows={rows} rowKey={(r) => r.id} />
          </div>

          <CardActions>
            <Button icon={IconDownload} onClick={toExcel}>
              تنزيل Excel
            </Button>
            <Button variant="secondary" icon={IconDownload} loading={exporting} onClick={toPdf}>
              تنزيل PDF
            </Button>
          </CardActions>

          {exportError && (
            <Alert tone="error" title="لم يكتمل التصدير">
              {exportError}
            </Alert>
          )}
        </Card>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        code={tool.code}
        title={tool.name}
        description="الدورة ثلاثية: صباحي ← مسائي ← راحة. حدّد اليوم الأول فقط، والباقي يُحسب."
      />

      <Tabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            id: "schedule",
            label: "📅 إنشاء جدول",
            content: scheduleContent,
          },
          {
            id: "employees",
            label: "👥 إدارة الموظفين",
            content: (
              <EmployeeManager
                employees={employees}
                onAdd={addEmployee}
                onUpdate={updateEmployee}
                onRemove={removeEmployee}
              />
            ),
          },
          {
            id: "offices",
            label: "🏢 إدارة المكاتب",
            content: (
              <OfficeManager
                offices={offices}
                onAdd={addOffice}
                onUpdate={updateOffice}
                onRemove={removeOffice}
              />
            ),
          },
        ]}
      />
    </>
  );
}
