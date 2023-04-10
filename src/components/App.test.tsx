
import { act, render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom';
import App from './App';
import { mockTiles } from '@/mocks/tiles';
import { Provider } from 'jotai/react';
import userEvent from '@testing-library/user-event';

jest.doMock('../config', () => {
    const originalConfig = jest.requireActual('../config');
    return {
        ...originalConfig,
        dimension: { x: 3, y: 3 }
    };
});

describe('App', () => {
    beforeEach(() => {
        render(
            <Provider>
                <App tileSet={mockTiles} />
            </Provider>
        )
    })

    it('should render all panels on page load', () => {
        const activeTilesPanel = screen.getByTestId('active-tiles-panel')
        expect(activeTilesPanel).toBeInTheDocument()

        const allTilesPanel = screen.getByTestId('all-tiles-panel')
        expect(allTilesPanel).toBeInTheDocument()

        const canvas = screen.getByTestId('selected-canvas')
        expect(canvas).toBeInTheDocument()

        const colorPanel = screen.getByTestId('color-panel')
        expect(colorPanel).toBeInTheDocument()
    })

    it('should render all tools on page load', () => {
        const toolbar = screen.getByTestId('toolbar')
        expect(toolbar).toBeInTheDocument()

        const zoom = screen.getByTestId('zoom')
        expect(zoom).toBeInTheDocument()
    })

    it('should be able to draw the selected tile in the canvas', async () => {
        const allTilesPanel = screen.getByTestId('all-tiles-panel')
        const aTile = within(allTilesPanel).getAllByRole('radio')[1] as HTMLInputElement

        act(() => { userEvent.click(aTile) })

        await waitFor(() => {
            expect(aTile).toBeChecked()
        })

        const canvas = screen.getByTestId('selected-canvas')
        const aCell = within(canvas).getAllByRole('button')[1]

        act(() => { userEvent.click(aCell) })

        await waitFor(() => {
            expect(aCell).toHaveTextContent(aTile.textContent!)
        })
    })

    it('should update the active tiles panel when drawing with a new tile', async () => {
        const activeTilesPanel = screen.getByTestId('active-tiles-panel')
        const content = within(activeTilesPanel).getByTestId('panel-content')

        const allTilesPanel = screen.getByTestId('all-tiles-panel')
        const aTile = within(allTilesPanel).getAllByRole('radio')[1]

        expect(content.childElementCount).toBe(1) // has empty tile only

        act(() => { userEvent.click(aTile) })

        await waitFor(() => {
            expect(aTile).toBeChecked()
        })

        const canvas = screen.getByTestId('selected-canvas')
        const aCell = within(canvas).getAllByRole('button')[1]

        act(() => { userEvent.click(aCell) })

        await waitFor(() => {
            const updatedContent = within(activeTilesPanel).getByTestId('panel-content')
            expect(updatedContent.childElementCount).toBe(2)
        })
    })
})