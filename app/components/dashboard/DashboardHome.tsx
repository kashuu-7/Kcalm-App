import CenterLeft from "./CenterLeft";
import CenterRight from "./CenterRight";
import DashboardBottom from "./DashboardBottom";
import StatsCards from "./StatsCards";
import Timeline from "./Timeline";

export default function DashboardHome() {
  return (
    <main>
      <div className="grid gap-[18px] animate-[viewin_.5s_var(--ease)]">
        <StatsCards />
        <div className="grid grid-cols-[minmax(0,_0.9fr)_minmax(0,_1.4fr)] max-[980px]:grid-cols-1 gap-[18px]" >
            <CenterLeft />
            <CenterRight />
        </div>
        <Timeline />
        <DashboardBottom />
      </div>
    </main>
  );
}
