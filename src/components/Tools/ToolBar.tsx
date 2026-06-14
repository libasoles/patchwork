import {
  actionAtom,
  colorMenuTargetAtom,
  useLayersApi,
  useSelectedLayer,
} from "@/store";
import { Action } from "@/types";
import { useAtom } from "jotai";
import { Brush, Eraser, Move, Pencil, RotateCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ActionButton from "./components/ActionButton";
import TypewriterEffect from "./components/TypewriterEffect";

const ICON_SIZE = 18;

const ToolBar = () => {
  const [, setColorMenuTarget] = useAtom(colorMenuTargetAtom);
  const [selectedAction, setSelected] = useAtom(actionAtom);
  const t = useTranslations("toolbar");

  useHotkeys("1", () => setSelected(Action.Draw));
  useHotkeys("2", () => setSelected(Action.Paint));
  useHotkeys("3", () => setSelected(Action.Move));
  useHotkeys("4", () => setSelected(Action.Rotate));
  useHotkeys("5", () => setSelected(Action.Delete));

  const { list, disable } = useLayersApi();
  const selectedLayer = useSelectedLayer();

  const disableLayers = useCallback(
    () =>
      list()
        .filter((layer) => layer.id !== selectedLayer)
        .map((layer) => disable(layer)),
    [list, selectedLayer, disable],
  );

  const selectActionAndFocusTileColors = useCallback(
    (action: Action) => {
      setSelected(action);
      setColorMenuTarget("tile");
    },
    [setSelected, setColorMenuTarget],
  );

  const selectActionAndDisableLayers = useCallback(
    (action: Action) => {
      setSelected(action);
      disableLayers();
    },
    [setSelected, disableLayers],
  );

  const actions = [
    {
      name: Action.Draw,
      icon: <Pencil size={ICON_SIZE} />,
      onClick: setSelected,
      shortcut: "1",
    },
    {
      name: Action.Paint,
      icon: <Brush size={ICON_SIZE} />,
      onClick: selectActionAndFocusTileColors,
      shortcut: "2",
    },
    {
      name: Action.Move,
      icon: <Move size={ICON_SIZE} />,
      onClick: selectActionAndDisableLayers,
      shortcut: "3",
    },
    {
      name: Action.Rotate,
      icon: <RotateCw size={ICON_SIZE} />,
      onClick: selectActionAndDisableLayers,
      shortcut: "4",
    },
    {
      name: Action.Delete,
      icon: <Eraser size={ICON_SIZE} />,
      onClick: selectActionAndDisableLayers,
      shortcut: "5",
    },
  ];

  return (
    <div
      data-testid="toolbar"
      className="toolbar flex justify-center items-center fixed top-3 z-10"
    >
      <div className="flex items-center gap-1 bg-gray-800 border border-slate-700/60 shadow-xl backdrop-blur rounded-full px-2 py-1.5">
        {actions.map((action) => (
          <ActionButton
            key={action.name}
            selected={selectedAction}
            {...action}
          />
        ))}

        <div
          data-testid="tool-name"
          className="hidden md:flex items-center pl-3 pr-3 ml-2 border-l-2 border-slate-600 text-slate-300 font-mono min-w-[7em]"
        >
          <TypewriterEffect text={t(Action[selectedAction])} speed={20} />
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
