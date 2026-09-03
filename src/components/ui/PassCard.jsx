import TailFacets from "./TailFacets";
import "./PassCard.css";

/**
 * بطاقة التقرير على هيئة بطاقة صعود: متن + كعب مثقوب.
 * الاختيار ليس زخرفيًا — المنتج نفسه تذاكر، والكعب يحمل رمز التقرير
 * تمامًا كما يحمل كعب البطاقة رمز الرحلة.
 */
export default function PassCard({ tool, onOpen }) {
  const { icon: Icon } = tool;

  return (
    <button className="b-pass" onClick={() => onOpen(tool.id)}>
      <span className="b-pass__body">
        <span className="b-pass__icon">
          <Icon size={22} />
        </span>
        <span className="b-pass__name">{tool.name}</span>
        <span className="b-pass__tagline">{tool.tagline}</span>
        <span className="b-pass__desc">{tool.description}</span>
        <span className="b-pass__input">
          <span className="b-pass__inputLabel">المُدخل</span>
          <span className="b-pass__inputValue">{tool.input}</span>
        </span>
      </span>

      <span className="b-pass__stub">
        <TailFacets className="b-pass__stubArt" opacity={0.35} />
        <span className="b-pass__code">{tool.code}</span>
      </span>
    </button>
  );
}
