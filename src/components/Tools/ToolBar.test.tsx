import { screen, render, within, waitFor } from '@testing-library/react'
import ToolBar from './ToolBar'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'jotai/react';
import { NextIntlClientProvider } from 'next-intl';
import { TooltipProvider } from '@/components/ui/tooltip';
import messages from '../../../messages/en.json';

// jsdom doesn't implement ResizeObserver, which Radix tooltips use when they
// mount (e.g. when a tool radio gains focus).
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(global as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub;

const renderToolBar = () =>
    render(
        <NextIntlClientProvider locale="en" messages={messages}>
            <TooltipProvider>
                <Provider>
                    <ToolBar />
                </Provider>
            </TooltipProvider>
        </NextIntlClientProvider>,
    )

describe('Toolbar', () => {
    beforeEach(() => {
        renderToolBar()
    })

    it('should have the draw tool selected by default', () => {
        const drawIcon = screen.getByTestId('draw-icon')

        const radioElement = within(drawIcon).getByRole('radio') as HTMLInputElement

        expect(radioElement).toBeChecked()
    })

    it('should switch to a different tool when clicked', async () => {
        const toolbar = screen.getByTestId('toolbar')

        const radioElements = within(toolbar).getAllByRole('radio')

        const paintIcon = radioElements[1] as HTMLInputElement

        expect(paintIcon).not.toBeChecked()

        userEvent.click(paintIcon)

        await waitFor(() => {
            expect(paintIcon).toBeChecked()
        })
    })

    it('should display the name of the tool', async () => {
        const toolbar = screen.getByTestId('toolbar')

        const radioElements = within(toolbar).getAllByRole('radio')
        const toolName = within(toolbar).getByTestId('tool-name')

        const paintIcon = radioElements[1] as HTMLInputElement

        await waitFor(() => {
            expect(toolName).toHaveTextContent('Draw')
        })

        userEvent.click(paintIcon)

        await waitFor(() => {
            expect(toolName).toHaveTextContent('Paint')
        })
    })

    it('should select a tool on keypress', async () => {
        const toolbar = screen.getByTestId('toolbar')

        const radioElements = within(toolbar).getAllByRole('radio')
        const moveIcon = radioElements[2] as HTMLInputElement
        const toolName = within(toolbar).getByTestId('tool-name')

        expect(moveIcon).not.toBeChecked()

        userEvent.keyboard('3')

        await waitFor(() => {
            expect(moveIcon).toBeChecked()
            expect(toolName).toHaveTextContent('Move')
        })
    })

    it('should select a tool on keypress while a tool radio is focused', async () => {
        const toolbar = screen.getByTestId('toolbar')

        const radioElements = within(toolbar).getAllByRole('radio')
        const paintIcon = radioElements[1] as HTMLInputElement
        const moveIcon = radioElements[2] as HTMLInputElement

        // Simulate the focus state left behind after clicking a tool: the radio
        // input keeps focus, which previously suppressed the number hotkeys.
        paintIcon.focus()
        expect(paintIcon).toHaveFocus()

        userEvent.keyboard('3')

        await waitFor(() => {
            expect(moveIcon).toBeChecked()
        })
    })
})
