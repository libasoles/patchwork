import { useTranslations } from "next-intl";

export default function Logo() {
  const t = useTranslations("meta");

  return (
    <div className="p-2 md:p-3 bg-gray-800 border-b border-slate-700/60">
      <h1 className="text-base md:text-2xl font-bold text-indigo-200 tracking-tight text-left">
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
