import { ChevronDown } from "lucide-react";
import { ReactElement, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

type Props = {
  title: string;
  className?: string;
  children: ReactElement | ReactElement[];
  collapsible?: boolean;
  defaultOpen?: boolean;
  hideTitle?: boolean;
};

export default function Panel({
  title,
  className,
  children,
  collapsible = false,
  defaultOpen = true,
  ...rest
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!collapsible) {
    return (
      <div
        {...rest}
        className={`${className} flex flex-col px-2 py-2 border-b border-slate-700/60 bg-gray-800`}
      >
        {title && (
          <h2 className="text-slate-100 text-xs font-semibold uppercase tracking-wider px-1 pb-2">
            {title}
          </h2>
        )}
        <Scrollbars style={{ width: 200 }} autoHide universal>
          <div
            data-testid="panel-content"
            className="panel-content flex flex-wrap content-baseline gap-0.5 p-px text-slate-200 h-auto"
          >
            {children}
          </div>
        </Scrollbars>
      </div>
    );
  }

  return (
    <div
      {...rest}
      className={`${isOpen ? className : ""} flex flex-col px-2 py-2 border-b border-slate-700/60 bg-gray-800`}
    >
      <h2
        className="text-slate-100 text-xs font-semibold uppercase tracking-wider px-1 pb-2 flex items-center justify-between cursor-pointer hover:text-slate-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </h2>
      {isOpen && (
        <Scrollbars style={{ width: 200 }} autoHide universal>
          <div
            data-testid="panel-content"
            className="panel-content flex flex-wrap content-baseline gap-0.5 p-px text-slate-200 h-auto"
          >
            {children}
          </div>
        </Scrollbars>
      )}
    </div>
  );
}
