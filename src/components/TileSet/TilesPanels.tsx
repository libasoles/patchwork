import { actionAtom } from "@/store";
import { useAtom } from "jotai";
import { ReactElement } from "react";

type Props = {
    children: ReactElement[]
}

export default function TilesPanels({ children }: Props) {
    const [action] = useAtom(actionAtom);

    return (
        <div className={`h-screen flex flex-col ${action === "paint" ? "hidden" : ""}`}>{children}</div>
    );
}
