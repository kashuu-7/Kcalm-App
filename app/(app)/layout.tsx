import type { ReactNode } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import HeaderGate from "../components/dashboard/HeaderGate";
import MobileNav from "../components/dashboard/MobileNav";
import OnboardingTopNav from "../components/dashboard/OnboardingTopNav";
import HelpModal from "../components/dashboard/HelpModal";
import { HelpProvider } from "../components/dashboard/HelpContext";
import { MealsProvider } from "../components/dashboard/MealsContext";
import { ProfileProvider } from "../components/profile/ProfileContext";
import { AuthGate } from "../components/auth/AuthGate";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
     <AuthGate>
    <MealsProvider>
      <ProfileProvider>
        <HelpProvider>
          <div className="grid grid-cols-[248px_minmax(0,1fr)] max-[940px]:grid-cols-1 min-h-screen bg-[#F8FAF8]">
            <div className="max-[940px]:hidden">
              <Sidebar />
            </div>

            <OnboardingTopNav />
            <main className="min-w-0 px-[clamp(16px,3vw,36px)] pb-[48px] max-[940px]:pb-[120px]">
              <HeaderGate />
              {children}
            </main>
          </div>

          <MobileNav />
          <HelpModal />
        </HelpProvider>
      </ProfileProvider>
    </MealsProvider>
    </AuthGate>
  );
}