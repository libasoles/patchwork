import { ReactElement } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

type Props = {
    title: string;
    className?: string;
    children: ReactElement | ReactElement[];
};

export default function Panel({ title, className, children, ...rest }: Props) {
    return (
        <div {...rest} className={`${className} flex flex-col p-[0.1rem] border-slate-400 border-x-border-[6px] bg-gray-200`}>
            <h2 className='text-gray-800'>{title}</h2>
            <Scrollbars style={{ width: 200 }} autoHide universal>
                <div data-testid='panel-content' className="panel-content flex flex-wrap content-baseline gap-0.5 p-px text-gray-800 h-auto">
                    {children}
                </div>
            </Scrollbars>
        </div>);
}
