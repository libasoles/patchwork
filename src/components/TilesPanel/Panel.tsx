import { ReactElement } from 'react';

type Props = {
    title: string;
    className?: string;
    children: ReactElement | ReactElement[];
};

export default function Panel({ title, className, children }: Props) {
    return (<div className={`${className}  h-full flex flex-col p-[0.1rem] overflow-y-hidden border-slate-400 border-x-border-[6px] bg-gray-200 `}>
        <h2 className='text-gray-800'>{title}</h2>
        <div className="flex flex-wrap gap-0.5 overflow-y-scroll w-[12.5em] p-px text-gray-800">
            {children}
        </div>
    </div>);
}
