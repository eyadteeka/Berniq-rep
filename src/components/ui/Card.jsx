import "./Card.css";

export function Card({ children, className = "", ...rest }) {
  return (
    <section className={`b-card ${className}`} {...rest}>
      {children}
    </section>
  );
}

export function CardHead({ step, title, hint, aside }) {
  return (
    <header className="b-card__head">
      <div className="b-card__headText">
        <h2 className="b-card__title">
          {step && <span className="b-card__step">{step}</span>}
          {title}
        </h2>
        {hint && <p className="b-card__hint">{hint}</p>}
      </div>
      {aside && <div className="b-card__aside">{aside}</div>}
    </header>
  );
}

export function CardActions({ children }) {
  return <div className="b-card__actions no-print">{children}</div>;
}
