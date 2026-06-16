import Image from "next/image";
import Link from "next/link";

interface LocaleLink {
  code: string;
  label: string;
}

interface ArticleHeaderProps {
  currentHref: string;
  lang: string;
  localeLinks: LocaleLink[];
  maxWidthClass?: string;
}

export default function ArticleHeader({
  currentHref,
  lang,
  localeLinks,
  maxWidthClass = "max-w-3xl",
}: ArticleHeaderProps) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div
        className={`mx-auto flex ${maxWidthClass} items-center justify-between gap-5 px-6 py-5`}
      >
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            aria-label="Patchwork"
            className="inline-flex shrink-0 items-center gap-2 text-zinc-950 transition-colors hover:text-teal-600 dark:text-zinc-50 dark:hover:text-teal-400"
          >
            <Image
              src="/icon-192.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-lg font-bold tracking-tight">patchwork</span>
          </Link>
        </div>

        <div className="flex shrink-0 gap-3 text-xs text-zinc-400">
          {localeLinks.map(({ code, label }) => (
            <Link
              key={code}
              href={currentHref}
              locale={code}
              className={`transition-colors ${
                lang === code
                  ? "font-semibold text-teal-500"
                  : "hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
