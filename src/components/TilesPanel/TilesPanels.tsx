import { actionAtom } from "@/store";
import { Action } from "@/types";
import { useAtom } from "jotai";
import { ReactElement } from "react";

type Props = {
    children: ReactElement[]
}

export default function TilesPanels({ children }: Props) {
    const [action] = useAtom(actionAtom);

    return (
        <div className={`h-screen flex flex-col ${action === Action.Paint ? "opacity-50" : ""}`}>{children}</div>
    );
}
