import { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardHead, CardActions } from "../../components/ui/Card";
import { Field, Select } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import FileDrop from "../../components/ui/FileDrop";
import DataTable from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import { IconLedger, IconDownload } from "../../components/ui/Icons";
import { parseAgentFopFile } from "../../lib/parsers";
import { readAnnualTemplate, applyMonthTotals } from "./annualEngine";
import { exportRawSheet } from "../../lib/exporters";
import { MONTHS_AR, percent, money } from "../../lib/format";
import { getTool } from "../../data/tools";
import "./AnnualPage.css";

const tool = getTool("annual");

export default function AnnualPage() {
  const [templateFiles, setTemplateFiles] = useState([]);
  const [template, setTemplate] = useState(null);
  const [templateError, setTemplateError] = useState(null);

  const [month, setMonth] = useState(new Date().getMonth());
  const [reportFiles, setReportFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [problems, setProblems] = useState([]);

  const loadTemplate = async (list) => {
    setTemplateFiles(list);
    setTemplate(null);
    setTemplateError(null);
    setOutcome(null);
    if (!list.length) return;
    try {
      setTemplate(await readAnnualTemplate(list[0]));
    } catch (err) {
      setTemplateError(err.message);
    }
  };

  const run = async () => {
    setBusy(true);
    setProblems([]);
    setOutcome(null);

    const entries = [];
    const failed = [];

    for (const file of reportFiles) {
      try {
        const parsed = await parseAgentFopFile(file);
        if (!parsed.agentId) {
          failed.push(`${file.name}: لم يُقرأ AgentID من الملف.`);
          continue;
        }
        entries.push({ code: parsed.agentId, total: parsed.totals.GRAND, file: file.name });
      } catch (err) {
        failed.push(err.message);
      }
    }

    if (entries.length) {
      setOutcome(applyMonthTotals({ template, monthIndex: month, entries }));
    }
    setProblems(failed);
    setBusy(false);
  };

  const download = () => {
    exportRawSheet({
      filename: `ALL_SALES_محدّث_${MONTHS_AR[month]}`,
      sheetName: template.sheetName,
      aoa: outcome.aoa,
    });
  };

  return (
    <>
      <PageHeader
        code={tool.code}
        title={tool.name}
        description="يُقرأ Sine Code من كل تقرير Videcom ويُطابق بصفوف القالب — لا إدخال يدوي للأكواد."
      />

      <Card>
        <CardHead step="1" title="قالب التتبّع السنوي" hint="ملف Excel يحتوي Sine Code وأعمدة الأشهر JAN…DEC." />
        <FileDrop
          label="ملف التتبّع (xlsx)"
          accept=".xlsx,.xls"
          files={templateFiles}
          onChange={loadTemplate}
        />
        {templateError && <Alert tone="error" title="القالب غير مقروء">{templateError}</Alert>}
        {template && (
          <Alert tone="ok" title={`تم التعرّف على ${template.employees.length} موظفًا`}>
            {template.employees.map((e) => e.name).join(" · ")}
          </Alert>
        )}
      </Card>

      <Card>
        <CardHead step="2" title="الشهر وتقارير الموظفين" hint="يُكتب إجمالي كل موظف في عمود الشهر المختار فقط، وتبقى بقية الأشهر كما هي." />
        <div className="b-annual__grid">
          <Field label="الشهر المستهدف">
            {(id) => (
              <Select
                id={id}
                value={month}
                disabled={!template}
                onChange={(e) => setMonth(Number(e.target.value))}
                options={MONTHS_AR.map((m, i) => ({ value: i, label: m }))}
              />
            )}
          </Field>
        </div>

        <FileDrop
          label="تقارير Videcom (PDF)"
          multiple
          files={reportFiles}
          onChange={setReportFiles}
          disabled={!template}
        />

        <CardActions>
          <Button
            icon={IconLedger}
            loading={busy}
            disabled={!template || !reportFiles.length}
            onClick={run}
          >
            تحديث عمود {MONTHS_AR[month]}
          </Button>
        </CardActions>

        {problems.length > 0 && (
          <Alert tone="error" title="ملفات لم تُقرأ">
            <ul className="b-annual__list">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Alert>
        )}
      </Card>

      {!outcome ? (
        <EmptyState icon={IconLedger} title="القالب لم يُحدَّث بعد">
          ارفع القالب وتقارير الموظفين، ثم اختر الشهر — تظهر المعاينة هنا قبل التنزيل.
        </EmptyState>
      ) : (
        <Card>
          <CardHead
            title={`معاينة بعد تحديث ${MONTHS_AR[month]}`}
            hint={`إجمالي المركز بعد التحديث: ${money(outcome.grand)}`}
          />

          {outcome.unmatched.length > 0 && (
            <Alert tone="warn" title="أكواد لم تُطابق أي صف في القالب">
              {outcome.unmatched.map((u) => `${u.code} (${u.file})`).join(" · ")}
            </Alert>
          )}

          <DataTable
            columns={[
              { id: "name", header: "الموظف" },
              { id: "code", header: "Sine Code", kind: "raw" },
              { id: "month", header: MONTHS_AR[month], kind: "money", strong: true },
              { id: "total", header: "الإجمالي السنوي", kind: "money" },
              { id: "share", header: "النسبة", kind: "raw" },
            ]}
            rows={outcome.preview.map((p) => ({
              name: p.name,
              code: <span className="num">{p.code}</span>,
              month: p.month,
              total: p.total,
              share: <span className="num">{percent(p.share)}</span>,
              __highlight: p.updated,
            }))}
            rowKey={(r, i) => i}
          />

          <p className="b-annual__legend">الصفوف المميّزة بخط ماجنتا هي التي حُدّثت في هذه العملية.</p>

          <CardActions>
            <Button icon={IconDownload} onClick={download}>
              تنزيل القالب المحدّث
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  );
}
