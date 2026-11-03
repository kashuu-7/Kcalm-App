import Header from "./components/Header";
import Hero from "./components/Hero";
import DaysPlan from "./components/DaysPlan";
import Ticker from "./components/Ticker";
import Diets from "./components/Diets";
import Stories from "./components/Stories";
import PricingMain from "./components/prcingwrap/PriceMain";
import BgGradient from "./components/BgGradient";

export default function Home() {
  return (
    <>
    <BgGradient />
    <div className="wrap max-w-[1200px] w-full mx-auto my-0 p-[40px] overflow-hidden">
      <Header />
      <Hero />
    </div>
    <Ticker />
    <DaysPlan />
    <Diets />
    <Stories />
    <PricingMain />
    </>
  );
}
