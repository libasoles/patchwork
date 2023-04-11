import { ReactElement } from 'react';

type Props = {
    title: string;
    className?: string;
    children: ReactElement | ReactElement[];
};

export default function Panel({ title, className, children, ...rest }: Props) {
    return (
        <div {...rest} className={`${className} flex flex-col p-[0.1rem] border-slate-400 border-x-border-[6px] bg-gray-200 `}>
            <h2 className='text-gray-800'>{title}</h2>
            <div data-testid='panel-content' className="panel-content flex flex-wrap gap-0.5 overflow-y-scroll w-[12.5em] p-px text-gray-800">
                {children}
            </div>
        </div>);
}
