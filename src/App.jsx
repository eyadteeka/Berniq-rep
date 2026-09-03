import { useEffect, useState } from "react";
import TopRail from "./components/layout/TopRail";
import HomePage from "./features/HomePage";
import SchedulePage from "./features/schedule/SchedulePage";
import SalesPage from "./features/sales/SalesPage";
import AnnualPage from "./features/annual/AnnualPage";
import { vendorsReady } from "./lib/vendors";
import "./App.css";

const VIEWS = {
  schedule: SchedulePage,
  sales: SalesPage,
  annual: AnnualPage,
};

export default function App() {
  const [view, setView] = useState("home");
  const [offline, setOffline] = useState(false);

  // المكتبات تُحمّل عبر <script> — نتحقّق مرة بعد الإقلاع.
  useEffect(() => {
    const id = setTimeout(() => setOffline(!vendorsReady()), 1200);
    return () => clearTimeout(id);
  }, []);

  const Page = VIEWS[view];

  return (
    <div className="b-app">
      <TopRail view={view} onNavigate={setView} offline={offline} />

      <main className="b-main" key={view}>
        {view === "home" ? <HomePage onOpen={setView} /> : <Page />}
      </main>

      <footer className="b-foot no-print">
        كل المعالجة تتم داخل المتصفح — لا يُرفع أي ملف إلى أي خادم.
      </footer>
    </div>
  );
}
