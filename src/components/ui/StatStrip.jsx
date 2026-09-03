import { money } from "../../lib/format";
import "./StatStrip.css";

/** items: [{ id, label, value, tone?, hint? }] */
export default function StatStrip({ items }) {
  return (
    <dl className="b-stats">
      {items.map((item) => (
        <div className="b-stats__item" key={item.id}>
          <dt className="b-stats__label">
            {item.tone && <i className="b-stats__dot" style={{ background: `var(${item.tone})` }} />}
            {item.label}
          </dt>
          <dd className="b-stats__value num">{money(item.value)}</dd>
          {item.hint && <dd className="b-stats__hint">{item.hint}</dd>}
        </div>
      ))}
    </dl>
  );
}
