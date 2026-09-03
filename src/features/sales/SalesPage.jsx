import { useRef, useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import { Card, CardHead, CardActions } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import FileDrop from "../../components/ui/FileDrop";
import DataTable from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import StatStrip from "../../components/ui/StatStrip";
import { DailyBars, PaymentDonut } from "../../components/ui/Charts";
import { IconSales, IconDownload, IconChart } from "../../components/ui/Icons";
import { parseAgentFopFile, aggregateAgents, PAYMENT_COLUMNS } from "../../lib/parsers";
import { exportSheet, exportElementToPdf } from "../../lib/exporters";
import { MONTHS_AR, money } from "../../lib/format";
import { getTool } from "../../data/tools";
import "./SalesPage.css";

const tool = getTool("sales");

const COLUMNS = [
  { id: "date", header: "التاريخ" },
  ...PAYMENT_COLUMNS.map((c) => ({ id: c.id, header: c.label, kind: "money", tone: c.token })),
  { id: "total", header: "المجموع", kind: "money", strong: true },
];

export default function SalesPage() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);
  const [agents, setAgents] = useState([]);
  const [problems, setProblems] = useState([]);
  const [exporting, setExporting] = useState(false);
  const printRef = useRef(null);

  const run = async () => {
    setBusy(true);
    setProblems([]);
    setReport(null);

    const parsed = [];
    const failed = [];

    for (const file of files) {
      try {
        parsed.push(await parseAgentFopFile(file));
      } catch (err) {
        failed.push(err.message);
      }
    }

    setProblems(failed);
    setAgents(parsed);
    if (parsed.length) setReport(aggregateAgents(parsed));
    setBusy(false);
  };

  const monthName = report?.rows.length
    ? MONTHS_AR[Number(report.rows[0].date.slice(3, 5)) - 1]
    : "";
  const yearName = report?.rows.length ? report.rows[0].date.slice(6) : "";
  const title = `تقرير المبيعات الفعلية — ${monthName} ${yearName}`;

  const toExcel = () => {
    const { rows, totals } = report;
    exportSheet({
      filename: `تقرير_المبيعات_${monthName}_${yearName}`,
      sheetName: "المبيعات الفعلية",
      colWidths: [14, 14, 14, 14, 14, 16],
      merges: [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }],
      aoa: [
        [title],
        ["التاريخ", "كاش", "صك", "وابس", "ادفعلي", "المجموع"],
        ...rows.map((r) => [r.date, r.cash, r.check, r.wps, r.other, r.total]),
        ["المجموع", totals.cash, totals.check, totals.wps, totals.other, totals.total],
      ],
    });
  };

  const toPdf = async () => {
    setExporting(true);
    try {
      await exportElementToPdf(printRef.current, `تقرير_المبيعات_${monthName}_${yearName}`);
    } catch (err) {
      setProblems([err.message]);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <PageHeader
        code={tool.code}
        title={tool.name}
        description="ارفع تقرير Videcom لكل موظف. تُقرأ المعاملات بتاريخها وقيمتها، ثم تُجمع كل الأيام عبر الموظفين في جدول واحد بقالب المكتب."
      />

      <Card>
        <CardHead step="1" title="تقارير الموظفين" hint="Sales Report by Agent + FOP — ملف PDF لكل موظف. الأيام الخالية من المبيعات تُحذف تلقائيًا." />
        <FileDrop
          label="تقارير المبيعات (PDF)"
          multiple
          files={files}
          onChange={setFiles}
          disabled={busy}
        />
        <CardActions>
          <Button icon={IconSales} loading={busy} disabled={!files.length} onClick={run}>
            {busy ? "جارٍ القراءة" : `تجميع ${files.length || ""} تقرير`}
          </Button>
        </CardActions>

        {problems.length > 0 && (
          <Alert tone="error" title="ملفات لم تُقرأ">
            <ul className="b-sales__list">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Alert>
        )}
      </Card>

      {!report ? (
        <EmptyState icon={IconChart} title="لم يُجمَّع أي تقرير بعد">
          ارفع تقارير الموظفين أعلاه. يقرأ النظام كل معاملة بتاريخها وطريقة دفعها ثم يبني جدول الشهر.
        </EmptyState>
      ) : (
        <>
          {!report.resolvedPaymentSplit && (
            <Alert tone="warn" title="تقارير بلا عمود FOP">
              هذه التقارير لا تحمل طريقة الدفع بجانب كل معاملة:{" "}
              <b>{report.missingFop.join("، ")}</b>. قيمها داخلة في المجموع اليومي لكنها
              غير موزّعة على الكاش والمصرفي، فيقلّ مجموع الأعمدة عن عمود المجموع. أعد
              تصديرها من Videcom مع تفعيل عمود <b>FOP</b> ليكتمل التوزيع.
            </Alert>
          )}

          <Card>
            <CardHead
              title={title}
              hint={`${agents.length} موظف · ${report.rows.length} يوم عمل`}
            />

            <StatStrip
              items={[
                ...PAYMENT_COLUMNS.map((c) => ({
                  id: c.id,
                  label: c.label,
                  value: report.totals[c.id],
                  tone: c.token,
                })),
                { id: "total", label: "إجمالي الشهر", value: report.totals.total },
              ]}
            />

            <div className="b-sales__charts">
              <DailyBars rows={report.rows} series={PAYMENT_COLUMNS} />
              <PaymentDonut totals={report.totals} series={PAYMENT_COLUMNS} />
            </div>

            <div ref={printRef} className="b-sales__print">
              <h3 className="b-sales__printTitle">{title}</h3>
              <DataTable
                columns={COLUMNS}
                rows={report.rows}
                rowKey={(r) => r.key}
                footer={{ date: "المجموع", ...report.totals }}
              />
            </div>

            <CardActions>
              <Button icon={IconDownload} onClick={toExcel}>
                تنزيل Excel
              </Button>
              <Button variant="secondary" icon={IconDownload} loading={exporting} onClick={toPdf}>
                تنزيل PDF
              </Button>
            </CardActions>
          </Card>

          <Card>
            <CardHead title="مصدر الأرقام" hint="ما استُخرج من كل ملف قبل التجميع — للمراجعة السريعة." />
            <DataTable
              columns={[
                { id: "agentId", header: "Sine Code", kind: "raw" },
                { id: "range", header: "المدى" },
                { id: "days", header: "أيام بمبيعات" },
                { id: "cash", header: "كاش", kind: "money" },
                { id: "bank", header: "مصرفي", kind: "money" },
                { id: "grand", header: "الإجمالي", kind: "money", strong: true },
              ]}
              rows={agents.map((a) => ({
                agentId: <span className="num">{a.agentId ?? "—"}</span>,
                range: a.range ?? "—",
                days: a.days.length,
                cash: a.totals.MMM,
                bank: a.totals.QQQ + a.totals.MMR,
                grand: a.totals.GRAND,
              }))}
              rowKey={(_, i) => i}
              footer={{
                agentId: "المجموع",
                range: "",
                days: "",
                cash: agents.reduce((s, a) => s + a.totals.MMM, 0),
                bank: agents.reduce((s, a) => s + a.totals.QQQ + a.totals.MMR, 0),
                grand: agents.reduce((s, a) => s + a.totals.GRAND, 0),
              }}
            />
            <p className="b-sales__note">
              يجب أن يطابق «الإجمالي» أعلاه مجموع الجدول اليومي ({money(report.totals.total)}).
            </p>
          </Card>
        </>
      )}
    </>
  );
}
