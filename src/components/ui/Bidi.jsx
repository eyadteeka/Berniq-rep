import "./Bidi.css";

/** نص LTR معزول — للتواريخ والأوقات والأرقام داخل سياق عربي */
export function LtrText({ children, className = "", title }) {
  return (
    <span className={`b-ltr ${className}`.trim()} dir="ltr" lang="en" title={title}>
      {children}
    </span>
  );
}

/** كتلة عربية RTL مع تشكيل صحيح */
export function ArabicText({ children, className = "", as: Tag = "span", ...rest }) {
  return (
    <Tag className={`b-ar ${className}`.trim()} dir="rtl" lang="ar" {...rest}>
      {children}
    </Tag>
  );
}
