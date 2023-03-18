import { ReactElement } from 'react';

type Props = {
    title: string;
    className?: string;
    children: ReactElement;
};

export default function Panel({ title, className, children }: Props) {
    return (<div className={`${className}  h-full flex flex-col p-[0.1rem] overflow-y-hidden border-slate-400 border-x-border-[6px] bg-gray-200 `}>
        <h2 className='text-gray-800'>{title}</h2>

        {children}
    </div>);
}
