import { Provider } from "jotai"
import '@testing-library/jest-dom'
import { render, screen, waitFor, within } from '@testing-library/react'
import Colors from "./Colors"
import userEvent from "@testing-library/user-event"

describe('Colors', () => {
    beforeEach(() => {
        render(
            <Provider>
                <Colors />
            </Provider>
        )
    })

    it('should display the selected color', () => {
        const colorPanel = screen.getByTestId('color-panel')

        const selectedColor = within(colorPanel).getByTestId('selected-color')

        expect(selectedColor).not.toBeNull();
        expect(colorPanel).toBeInTheDocument()
    })

    it('should display all colors by default', () => {
        const colorPanel = screen.getByTestId('selectable-colors')
        const colors = within(colorPanel).getAllByTestId('color-circle')
        expect(colors).toHaveLength(16)
    })

    it('should toggle colors when selected color is clicked', async () => {
        const colorPanel = screen.getByTestId('color-panel')
        const colorElement = within(colorPanel).getByTestId('selected-color')
        const selectedColor = within(colorElement).getByTestId('radio')

        userEvent.click(selectedColor)

        waitFor(() => {
            const colors = within(colorPanel).getAllByTestId('color-circle')
            expect(colors).toHaveLength(0)
        })
    })
})
