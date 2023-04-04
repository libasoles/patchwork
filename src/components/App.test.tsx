
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom';
import App from './App';
import { mockTiles } from '@/mocks/tiles';
import { Provider } from 'jotai/react';
import userEvent from '@testing-library/user-event';

describe('App', () => {
    beforeEach(() => {
        render(
            <Provider>
                <App tileSet={mockTiles} dimension={{ x: 3, y: 3 }} />
            </Provider>
        )
    })

    it('should render all panels on page load', () => {
        const activeTilesPanel = screen.getByTestId('active-tiles-panel')
        expect(activeTilesPanel).toBeInTheDocument()

        const allTilesPanel = screen.getByTestId('all-tiles-panel')
        expect(allTilesPanel).toBeInTheDocument()

        const grid = screen.getByTestId('grid')
        expect(grid).toBeInTheDocument()

        const colorPanel = screen.getByTestId('color-panel')
        expect(colorPanel).toBeInTheDocument()
    })

    it('should render all tools on page load', () => {
        const toolbar = screen.getByTestId('toolbar')
        expect(toolbar).toBeInTheDocument()

        const zoom = screen.getByTestId('zoom')
        expect(zoom).toBeInTheDocument()
    })

    it('should be able to draw the selected tile in the grid', async () => {
        const allTilesPanel = screen.getByTestId('all-tiles-panel')
        const aTile = within(allTilesPanel).getAllByRole('radio')[1] as HTMLInputElement

        act(() => { fireEvent.click(aTile) })

        await waitFor(() => {
            expect(aTile).toBeChecked()
        })

        const grid = screen.getByTestId('grid')
        const aCell = within(grid).getAllByRole('button')[1]

        act(() => { userEvent.click(aCell) })

        await waitFor(() => {
            expect(aCell).toHaveTextContent(aTile.value)
        })
    })

    it('should update the active tiles panel when using a new one', async () => {
        const activeTilesPanel = screen.getByTestId('active-tiles-panel')
        const content = within(activeTilesPanel).getByTestId('panel-content')

        const allTilesPanel = screen.getByTestId('all-tiles-panel')
        const aTile = within(allTilesPanel).getAllByRole('radio')[1]

        expect(content.childElementCount).toBe(1) // has empty tile only

        act(() => { fireEvent.click(aTile) })

        await waitFor(() => {
            expect(aTile).toBeChecked()
        })

        const grid = screen.getByTestId('grid')
        const aCell = within(grid).getAllByRole('button')[1]

        act(() => { userEvent.click(aCell) })

        await waitFor(() => {
            const content2 = within(activeTilesPanel).getByTestId('panel-content')
            expect(content2.childElementCount).toBe(2)
        })
    })
})