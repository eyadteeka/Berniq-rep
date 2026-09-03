import Logo from "../ui/Logo";
import Button from "../ui/Button";
import TailFacets from "../ui/TailFacets";
import { IconBack, IconOffline } from "../ui/Icons";
import { TOOLS } from "../../data/tools";
import "./TopRail.css";

export default function TopRail({ view, onNavigate, offline }) {
  const atHome = view === "home";

  return (
    <header className="b-rail">
      <TailFacets className="b-rail__facets" opacity={0.5} />

      <div className="b-rail__inner">
        <button className="b-rail__brand" onClick={() => onNavigate("home")} aria-label="الصفحة الرئيسية">
          <Logo size={38} />
        </button>

        <nav className="b-rail__nav" aria-label="أدوات التقارير">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              className={`b-rail__tab ${view === tool.id ? "is-active" : ""}`}
              onClick={() => onNavigate(tool.id)}
              aria-current={view === tool.id ? "page" : undefined}
            >
              <span className="b-rail__code">{tool.code}</span>
              <span className="b-rail__tabName">{tool.name}</span>
            </button>
          ))}
        </nav>

        <div className="b-rail__end">
          {offline && (
            <span className="b-rail__offline" title="بعض المكتبات لم تُحمّل — التصدير قد لا يعمل">
              <IconOffline size={16} />
              غير متصل
            </span>
          )}
          {!atHome && (
            <Button variant="onDark" size="sm" icon={IconBack} onClick={() => onNavigate("home")}>
              الرئيسية
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
