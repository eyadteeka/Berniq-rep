/**
 * العنصر المميّز للتطبيق: زخرفة الذيل المُضلّعة (low-poly)
 * المأخوذة من كسوة طائرات برنيق. تتكرّر في ثلاثة مواضع فقط —
 * ترويسة الصفحة، كعب بطاقة التقرير، ومؤشّر التبويب النشط —
 * ولا تُستخدم كزينة في أي مكان آخر.
 */
export default function TailFacets({ className, opacity = 1 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="tf-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--magenta-400)" />
          <stop offset="1" stopColor="var(--plum-700)" />
        </linearGradient>
      </defs>
      <g fill="url(#tf-a)">
        <polygon points="60,0 120,0 120,42" opacity=".85" />
        <polygon points="60,0 120,42 74,58" opacity=".55" />
        <polygon points="60,0 74,58 30,40" opacity=".7" />
        <polygon points="30,40 74,58 46,96" opacity=".4" />
        <polygon points="74,58 120,42 120,104" opacity=".3" />
        <polygon points="74,58 120,104 82,120" opacity=".62" />
        <polygon points="46,96 74,58 82,120" opacity=".22" />
        <polygon points="46,96 82,120 54,152" opacity=".5" />
        <polygon points="82,120 120,104 120,160" opacity=".38" />
        <polygon points="82,120 120,160 54,152" opacity=".16" />
      </g>
    </svg>
  );
}
