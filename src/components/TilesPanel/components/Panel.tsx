import { ReactElement, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { ChevronDown } from "lucide-react";

type Props = {
    title: string;
    className?: string;
    children: ReactElement | ReactElement[];
    collapsible?: boolean;
    defaultOpen?: boolean;
};

export default function Panel({ title, className, children, collapsible = false, defaultOpen = true, ...rest }: Props) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (!collapsible) {
        return (
            <div {...rest} className={`${className} flex flex-col p-[0.1rem] border-slate-400 border-x-border-[6px] bg-gray-200`}>
                <h2 className='text-gray-800'>{title}</h2>
                <Scrollbars style={{ width: 200 }} autoHide universal>
                    <div data-testid='panel-content' className="panel-content flex flex-wrap content-baseline gap-0.5 p-px text-gray-800 h-auto">
                        {children}
                    </div>
                </Scrollbars>
            </div>
        );
    }

    return (
        <div {...rest} className={`${isOpen ? className : ''} flex flex-col p-[0.1rem] border-slate-400 border-x-border-[6px] bg-gray-200`}>
            <h2
                className='text-gray-800 flex items-center justify-between cursor-pointer hover:text-gray-600'
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </h2>
            {isOpen && (
                <Scrollbars style={{ width: 200 }} autoHide universal>
                    <div data-testid='panel-content' className="panel-content flex flex-wrap content-baseline gap-0.5 p-px text-gray-800 h-auto">
                        {children}
                    </div>
                </Scrollbars>
            )}
        </div>
    );
}

