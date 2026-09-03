import PassCard from "../components/ui/PassCard";
import TailFacets from "../components/ui/TailFacets";
import plane from "../assets/berniq-plane.webp";
import { TOOLS } from "../data/tools";
import "./HomePage.css";

export default function HomePage({ onOpen }) {
  return (
    <>
      <section className="b-hero">
        <TailFacets className="b-hero__art" opacity={0.16} />
        <div className="b-hero__text">
          <span className="b-hero__eyebrow">مركز مبيعات مصراتة · مطار مصراتة</span>
          <h1 className="b-hero__title">
            تقارير آخر الشهر
            <em> في دقائق</em>
          </h1>
          <p className="b-hero__lede">
            ثلاث أدوات تقرأ ملفات Videcom وقوالب المكتب مباشرة في المتصفح، وتخرج
            الجداول جاهزة للاعتماد. لا يغادر أي ملف جهازك.
          </p>
        </div>
        <img className="b-hero__plane" src={plane} alt="" aria-hidden="true" />
      </section>

      <div className="b-passes">
        {TOOLS.map((tool) => (
          <PassCard key={tool.id} tool={tool} onOpen={onOpen} />
        ))}
      </div>
    </>
  );
}
