import { useAtom } from 'jotai';
import { zoomLevelAtom } from '../store';

export default function Zoom() {
    const [zoomLevel, setZoomLevel] = useAtom(zoomLevelAtom);

    return (
        <div className='fixed bottom-3 '>
            <input
                min="1"
                max="50"
                type="range"
                name="zoomLevel"
                value={zoomLevel}
                onChange={e => setZoomLevel(Number(e.target.value))} />
        </div>
    );
}
