import "./PageHeader.css";

export default function PageHeader({ code, title, description, meta }) {
  return (
    <div className="b-pageHead">
      <div>
        <span className="b-pageHead__code">{code}</span>
        <h1 className="b-pageHead__title">{title}</h1>
        <p className="b-pageHead__desc">{description}</p>
      </div>
      {meta && <div className="b-pageHead__meta">{meta}</div>}
    </div>
  );
}
