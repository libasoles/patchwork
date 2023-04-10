import DownloadIcon from "@/icons/DownloadIcon";
import { RefObject, useRef } from "react";
import { exportComponentAsPNG } from '@/utils';
import { useCanvasApi } from "@/store";
import { Tile } from "@/types";

// TODO: improve performance. It's taking ages
export default function ExportButton() {
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleExportClick = async () => {
        if (canvasRef && canvasRef.current) {
            const tmpUrl = await exportComponentAsPNG(canvasRef.current);

            const link = document.createElement('a');
            link.download = 'image.png';
            link.href = tmpUrl;
            link.click();
        }
    };

    return <div className="w-9 fixed top-3 right-16 z-10">
        <button
            type="button"
            className={`p-2 w-[2.4em] rounded-full cursor-pointer bg-slate-300 border-slate-500 border-[2px] text-gray-800`}
            onClick={handleExportClick}
            title='Export as PNG'
        >
            <DownloadIcon />
        </button>

        {/* TODO: only render this when up to export */}
        {/* <TemporalCanvas canvasRef={canvasRef} /> */}
    </div>
}

function TemporalCanvas({ canvasRef: canvasRef }: { canvasRef: RefObject<HTMLDivElement> }) {
    const { getCurrentCanvas } = useCanvasApi()
    const canvas = getCurrentCanvas()

    const cellSize = 40

    // TODO: grab dimension from jotai
    const dimension = { x: 100, y: 50 }

    return (
        <div ref={canvasRef} style={{ position: 'absolute', top: -100000 }}>
            <div
                className={`grid justify-center gap-0 select-none`}
                style={{
                    gridTemplateColumns: `repeat(${dimension.x}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${dimension.y}, ${cellSize}px)`,
                }}
            >
                {canvas.map((tile, index) => <TemporalCell key={index} size={cellSize} tile={tile} />)}
            </div>
        </div>
    )
}

function TemporalCell({ size, tile }: { size: number, tile: Tile }) {
    return (
        <div className={`cursor-[inherit] bg-transparent border-none`} style={{
            width: size + "px",
            height: size + "px",
            transform: `rotate(${90 * tile.orientation}deg)`,
            // @ts-ignore
            containerType: "inline-size"
        }}>
            <div className={`tile w-full h-full grid items-center text-${tile.color}`}>
                <span className="w-full h-full" style={{
                    lineHeight: .7,
                    fontSize: "143cqw"
                }}>{tile.symbol}</span>
            </div>
        </div>
    );
}