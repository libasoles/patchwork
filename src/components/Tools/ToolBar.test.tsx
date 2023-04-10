import { screen, render, within, act, waitFor } from '@testing-library/react'
import ToolBar from './ToolBar'
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'jotai/react';

describe('Toolbar', () => {
    beforeEach(() => {
        render(
            <Provider>
                <ToolBar />
            </Provider>
        )
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

        expect(toolName).toHaveTextContent('Draw')

        userEvent.click(paintIcon)

        await waitFor(() => {
            expect(toolName).toHaveTextContent('Paint')
        })
    })
})