import "./EmptyState.css";

/** الشاشة الفارغة دعوة للتصرّف، لا رسالة اعتذار. */
export default function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="b-empty">
      {Icon && (
        <span className="b-empty__icon">
          <Icon size={26} />
        </span>
      )}
      <h3 className="b-empty__title">{title}</h3>
      {children && <p className="b-empty__text">{children}</p>}
      {action && <div className="b-empty__action">{action}</div>}
    </div>
  );
}
