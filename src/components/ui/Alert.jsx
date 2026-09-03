import { IconCheck, IconAlert } from "./Icons";
import "./Alert.css";

const ICONS = { ok: IconCheck, error: IconAlert, warn: IconAlert, info: IconAlert };

export default function Alert({ tone = "info", title, children }) {
  const Icon = ICONS[tone];
  return (
    <div className={`b-alert b-alert--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <Icon size={18} />
      <div className="b-alert__body">
        {title && <strong>{title}</strong>}
        {children && <div className="b-alert__text">{children}</div>}
      </div>
    </div>
  );
}
