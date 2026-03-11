import { useTranslations } from "next-intl";

export default function Logo() {
  const t = useTranslations("meta");

  return (
    <div className="p-2 md:p-4 bg-slate-100 border-b border-slate-200">
      <h1 className="text-base md:text-2xl font-bold text-slate-800 tracking-tight text-center">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
          .logo-font {
            font-family: "Inter", sans-serif;
          }
        `}</style>
        <span className="logo-font lowercase">patchwork</span>
      </h1>
    </div>
  );
}
