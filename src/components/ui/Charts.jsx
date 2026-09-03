import { money } from "../../lib/format";
import "./Charts.css";

/* ---------- عمود يومي مكدّس: يعرض شكل الشهر لا مجرد أرقامه ---------- */
export function DailyBars({ rows, series }) {
  const max = Math.max(...rows.map((r) => series.reduce((s, k) => s + Math.max(0, r[k.id]), 0)), 1);

  return (
    <figure className="b-chart">
      <figcaption className="b-chart__title">حركة المبيعات اليومية</figcaption>
      <div className="b-chart__bars" role="img" aria-label="مخطط أعمدة للمبيعات اليومية">
        {rows.map((row) => {
          const total = series.reduce((s, k) => s + Math.max(0, row[k.id]), 0);
          const height = Math.max((total / max) * 100, 1.5);
          return (
            <div className="b-chart__col" key={row.key} title={`${row.date} — ${money(total)}`}>
              <div className="b-chart__stack" style={{ height: `${height}%` }}>
                {series.map((s) => {
                  const part = Math.max(0, row[s.id]);
                  if (!part) return null;
                  return (
                    <span
                      key={s.id}
                      className="b-chart__seg"
                      style={{
                        flexGrow: part,
                        background: `var(${s.token})`,
                      }}
                    />
                  );
                })}
              </div>
              <span className="b-chart__tick num">{row.date.slice(0, 2)}</span>
            </div>
          );
        })}
      </div>
      <Legend series={series} />
    </figure>
  );
}

/* ---------- حلقة النسب: توزيع طرق الدفع ---------- */
export function PaymentDonut({ totals, series }) {
  const sum = series.reduce((s, k) => s + Math.max(0, totals[k.id]), 0);
  const R = 54;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <figure className="b-chart b-chart--donut">
      <figcaption className="b-chart__title">توزيع طرق الدفع</figcaption>
      <div className="b-chart__donutWrap">
        <svg viewBox="0 0 140 140" className="b-chart__donut" role="img" aria-label="نسب طرق الدفع">
          <circle cx="70" cy="70" r={R} className="b-chart__track" />
          {series.map((s) => {
            const value = Math.max(0, totals[s.id]);
            if (!value || !sum) return null;
            const len = (value / sum) * C;
            const dash = `${len} ${C - len}`;
            const el = (
              <circle
                key={s.id}
                cx="70"
                cy="70"
                r={R}
                className="b-chart__arc"
                stroke={`var(${s.token})`}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
          <text x="70" y="66" className="b-chart__center">الإجمالي</text>
          <text x="70" y="86" className="b-chart__centerValue">{money(sum)}</text>
        </svg>
      </div>
      <Legend
        series={series}
        value={(s) => (sum ? `${((Math.max(0, totals[s.id]) / sum) * 100).toFixed(1)}%` : "0%")}
      />
    </figure>
  );
}

function Legend({ series, value }) {
  return (
    <ul className="b-chart__legend">
      {series.map((s) => (
        <li key={s.id}>
          <i style={{ background: `var(${s.token})` }} />
          <span>{s.label}</span>
          {value && <b className="num">{value(s)}</b>}
        </li>
      ))}
    </ul>
  );
}
