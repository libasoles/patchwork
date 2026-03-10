import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="size-4 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-slate-300" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "!bg-gray-800 !text-white !border-white/10 !rounded-2xl !shadow-xl !px-4 !py-3 !text-sm !font-medium",
          title: "!text-white !font-medium",
          description: "!text-slate-400 !text-xs",
          actionButton: "!bg-white/10 !text-white hover:!bg-white/20",
          cancelButton: "!bg-transparent !text-slate-400",
          closeButton:
            "!bg-gray-700 !text-slate-400 hover:!bg-gray-600 hover:!text-white !border-white/10",
          icon: "!mt-0 !mr-3",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
