import { useAtom } from 'jotai';
import { zoomLevelAtom } from '@/store';
import { useHotkeys } from 'react-hotkeys-hook';
import { clamp } from '@/utils';

const min = 1
const max = 50

export default function Zoom() {
    const [zoomLevel, setZoomLevel] = useAtom(zoomLevelAtom);

    const zoomIn = () => setZoomLevel(value => clamp(value + 1, min, max))
    const zoomOut = () => setZoomLevel(value => clamp(value - 1, min, max))

    useHotkeys('ctrl&+', zoomIn, { combinationKey: '&' })
    useHotkeys('ctrl+-', zoomOut)

    return (
        <div data-testid='zoom' className='fixed bottom-3'>
            <input
                min={min}
                max={max}
                type="range"
                name="zoomLevel"
                value={zoomLevel}
                className="hover:cursor-pointer"
                onChange={e => setZoomLevel(Number(e.target.value))} />
        </div>
    );
}
