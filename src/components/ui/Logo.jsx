import mark from "../../assets/berniq-mark.png";
import "./Logo.css";

export default function Logo({ size = 40, showWordmark = true, tone = "light" }) {
  return (
    <span className={`b-logo b-logo--${tone}`}>
      <img
        className="b-logo__mark"
        src={mark}
        alt="برنيق للطيران"
        width={size}
        height={size}
        draggable="false"
      />
      {showWordmark && (
        <span className="b-logo__text">
          <span className="b-logo__name">BERNIQ</span>
          <span className="b-logo__sub">AIRWAYS · مصراتة</span>
        </span>
      )}
    </span>
  );
}
