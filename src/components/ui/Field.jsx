import "./Field.css";

let seq = 0;
const nextId = () => `f${(seq += 1)}`;

export function Field({ label, hint, error, children, id }) {
  const fieldId = id ?? nextId();
  return (
    <div className={`b-field ${error ? "is-error" : ""}`}>
      <label className="b-field__label" htmlFor={fieldId}>
        {label}
      </label>
      {typeof children === "function" ? children(fieldId) : children}
      {error ? (
        <p className="b-field__msg b-field__msg--error">{error}</p>
      ) : (
        hint && <p className="b-field__msg">{hint}</p>
      )}
    </div>
  );
}

export function TextInput(props) {
  return <input className="b-input" type="text" {...props} />;
}

export function DateInput(props) {
  return <input className="b-input b-input--data" type="date" {...props} />;
}

export function Select({ options, ...rest }) {
  return (
    <div className="b-select">
      <select className="b-input" {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className="b-select__caret" viewBox="0 0 12 8" aria-hidden="true">
        <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function FieldRow({ children }) {
  return <div className="b-fieldRow">{children}</div>;
}
