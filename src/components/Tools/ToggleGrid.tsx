import { useAtom } from 'jotai';
import { gridVisibilityAtom } from '@/store';
import GridIcon from '@/icons/GridIcon';

export default function ToggleGrid() {
    const [isVisible, setVisible] = useAtom(gridVisibilityAtom);

    return (
        <div className="w-9 fixed top-3 right-28 z-10">
            <button
                type="button"
                className={`p-2 w-[2.4em] rounded-full cursor-pointer border-slate-500 border-[2px] ${isVisible ? 'bg-blue-500 text-white' : 'bg-slate-300 text-gray-800'}`}
                onClick={() => {
                    setVisible(isVisible => !isVisible)
                }}
                title='Toggle grid'
            >
                <GridIcon />
            </button>
        </div>
    );
}
