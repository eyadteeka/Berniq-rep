import { IconRoster, IconSales, IconLedger } from "../components/ui/Icons";

/** مصدر واحد للحقيقة: التنقّل، البطاقات، وعناوين الصفحات تقرأ من هنا. */
export const TOOLS = [
  {
    id: "schedule",
    code: "RSTR",
    name: "جدول الدوام",
    tagline: "دورة صباح · مساء · راحة",
    description:
      "حدّد وضع اليوم الأول لكل موظف، ويكمل النظام الدورة الثلاثية حتى نهاية الشهر.",
    icon: IconRoster,
    input: "بدون ملفات",
  },
  {
    id: "sales",
    code: "DSLS",
    name: "المبيعات اليومية",
    tagline: "تجميع مبيعات المكتب يومًا بيوم",
    description:
      "ارفع تقارير Videcom لكل موظف، فيُجمَع كل يوم عبر الموظفين ويخرج بقالب مشرف المركز.",
    icon: IconSales,
    input: "PDF لكل موظف",
  },
  {
    id: "annual",
    code: "ANNL",
    name: "التتبّع السنوي",
    tagline: "تحديث عمود الشهر في الملف الشامل",
    description:
      "يقرأ AgentID من كل تقرير، يطابقه بـ Sine Code، ويعيد حساب TOTAL والنسبة المئوية.",
    icon: IconLedger,
    input: "Excel + PDF",
  },
];

export const getTool = (id) => TOOLS.find((t) => t.id === id);
