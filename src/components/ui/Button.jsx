import "./Button.css";

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled,
  children,
  className = "",
  ...rest
}) {
  return (
    <button
      type="button"
      className={`b-btn b-btn--${variant} b-btn--${size} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="b-btn__spin" aria-hidden="true" /> : Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  );
}
