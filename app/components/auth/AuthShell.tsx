import Link from "next/link";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export default function AuthShell({
  title,
  accent,
  subtitle,
  footer,
  children,
}: {
  title: string;
  accent: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen content-center justify-items-center gap-[22px] bg-[#F8FAF8] px-[16px] py-[28px]">
      <Link
        href="/"
        className={`${bricolage.className} inline-flex items-center gap-[9px] text-[22px] font-[700] tracking-[-.05em] text-[#1d2a22]`}
      >
        <i className="h-[22px] w-[22px] rounded-full bg-[conic-gradient(from_200deg,#5FAE6E,#F4A07E,#E9D98A,#5FAE6E)]" />
        Kcalm
      </Link>

      <div className="w-full max-w-[440px] animate-[viewin_.5s_var(--ease)] rounded-[24px] border border-[#1d2a2214] bg-white p-[28px] shadow-[var(--shadow)] max-sm:p-[22px]">
        <h1
          className={`${bricolage.className} m-0 text-[clamp(28px,5vw,34px)] font-semibold leading-[1.1] tracking-[-0.03em] text-balance`}
        >
          {title}{" "}
          <span className={`${serif.className} tracking-[-.01em]`}>{accent}</span>
        </h1>
        <p className="mt-[8px] text-[14px] text-[#5B665F]">{subtitle}</p>
        <div className="mt-[22px]">{children}</div>
      </div>

      <p className="text-[13.5px] text-[#5B665F]">{footer}</p>
    </main>
  );
}