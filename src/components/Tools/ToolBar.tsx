import {
  actionAtom,
  colorMenuTargetAtom,
  selectedTileAtom,
  useLayersApi,
  useSelectedLayer,
} from "@/store";
import { defaultSelectedTile, emptyTile } from "@/config";
import { createTile } from "@/factory";
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
  const [selectedTile, setSelectedTile] = useAtom(selectedTileAtom);
  const t = useTranslations("toolbar");

  const selectAction = useCallback(
    (action: Action) => {
      setSelected(action);

      if (action === Action.Delete) {
        setSelectedTile(createTile(emptyTile));
        return;
      }

      if (selectedTile.isEmpty()) {
        setSelectedTile(createTile(defaultSelectedTile));
      }
    },
    [selectedTile, setSelected, setSelectedTile],
  );

  // enableOnFormTags: the visual tool/tile/color controls are <input type="radio">
  // elements that take focus on click, which would otherwise suppress these hotkeys.
  const hotkeyOptions = { enableOnFormTags: true };
  useHotkeys("1", () => selectAction(Action.Draw), hotkeyOptions, [selectAction]);
  useHotkeys("2", () => selectAction(Action.Paint), hotkeyOptions, [selectAction]);
  useHotkeys("3", () => selectAction(Action.Move), hotkeyOptions, [selectAction]);
  useHotkeys("4", () => selectAction(Action.Rotate), hotkeyOptions, [selectAction]);
  useHotkeys("5", () => selectAction(Action.Delete), hotkeyOptions, [selectAction]);

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
      selectAction(action);
      setColorMenuTarget("tile");
    },
    [selectAction, setColorMenuTarget],
  );

  const selectActionAndDisableLayers = useCallback(
    (action: Action) => {
      selectAction(action);
      disableLayers();
    },
    [selectAction, disableLayers],
  );

  const actions = [
    {
      name: Action.Draw,
      icon: <Pencil size={ICON_SIZE} />,
      onClick: selectAction,
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
