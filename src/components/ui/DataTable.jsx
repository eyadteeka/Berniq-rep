import { LtrText } from "./Bidi";
import { money } from "../../lib/format";
import "./DataTable.css";

/**
 * columns: [{ id, header, align?, kind?: 'text'|'money'|'raw', width?, tone? }]
 * footer:  صف المجموع (اختياري) بنفس مفاتيح الأعمدة.
 */
export default function DataTable({ columns, rows, footer, caption, rowKey = (r, i) => i, empty }) {
  if (!rows.length && empty) return empty;

  const renderCell = (col, row) => {
    const value = row[col.id];
    if (col.kind === "money") {
      const n = Number(value) || 0;
      return <span className={`num ${n < 0 ? "num--neg" : ""}`}>{money(n)}</span>;
    }
    if (col.cellBidi === "ltr") return <LtrText>{value}</LtrText>;
    if (col.kind === "raw") return value;
    return value;
  };

  const cellAlign = (col) => {
    if (col.align) return col.align;
    if (col.kind === "money") return "right";
    return "left";
  };

  return (
    <div className="b-table__scroll">
      <table className="b-table">
        {caption && <caption className="b-table__caption">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.id}
                scope="col"
                lang={c.headerBidi === "ltr" ? "en" : "ar"}
                dir={c.headerBidi === "ltr" ? "ltr" : "rtl"}
                style={{
                  textAlign: cellAlign(c),
                  width: c.width,
                }}
              >
                {c.tone && <i className="b-table__swatch" style={{ background: `var(${c.tone})` }} />}
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row, i)} className={row.__highlight ? "is-highlight" : undefined}>
              {columns.map((c) => (
                <td
                  key={c.id}
                  className={`b-table__cell${c.strong ? " is-strong" : ""}`}
                  style={{ textAlign: cellAlign(c) }}
                >
                  {renderCell(c, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot>
            <tr>
              {columns.map((c) => (
                <td key={c.id} style={{ textAlign: cellAlign(c) }}>
                  {renderCell(c, footer)}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
