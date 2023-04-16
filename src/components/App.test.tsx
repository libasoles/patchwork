
import { act, render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom';
import App from './App';
import { mockTiles } from '@/mocks/tiles';
import { Provider } from 'jotai/react';
import userEvent from '@testing-library/user-event';

jest.mock('@/config', () => {
    const originalConfig = jest.requireActual('@/config');

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
        const activeTilesPanel = getActiveTilesPanel()
        expect(activeTilesPanel).toBeInTheDocument()

        const allTilesPanel = getAllTilesPanel()
        expect(allTilesPanel).toBeInTheDocument()

        const canvas = getCurrentCanvas()
        expect(canvas).toBeInTheDocument()

        const colorPanel = getColorPanel()
        expect(colorPanel).toBeInTheDocument()
    })

    it('should render all tools on page load', () => {
        const toolbar = getToolBar()
        expect(toolbar).toBeInTheDocument()

        const zoom = screen.getByTestId('zoom')
        expect(zoom).toBeInTheDocument()
    })

    it('should be able to draw the selected tile in the canvas', async () => {
        const aTile = selectTile(2);

        await waitFor(() => {
            expect(aTile).toBeChecked()
        })

        const aCell = clickCanvasCell(1)

        await waitFor(() => {
            expect(aCell).toHaveTextContent(aTile.textContent!)
        })
    })

    it('should update the active tiles panel when drawing with a new tile', async () => {
        assertNumberOfActiveTilesIs(1);

        const aTile = selectTile(2);

        await waitFor(() => {
            expect(aTile).toBeChecked()
        })

        clickCanvasCell(7);

        await waitFor(() => {
            const activeTilesPanel = getActiveTilesPanel();
            const updatedContent = within(activeTilesPanel).getByTestId('panel-content')
            expect(updatedContent.childElementCount).toBe(2)
        })
    })

    it('should paint the select tile color in the tileset when a color is selected', async () => {
        selectColor(0);

        const { symbolElement } = await findSelectedTile()

        expect(symbolElement).toHaveClass('text-gray-800')

        selectColor(2);

        await waitFor(() => {
            expect(symbolElement).toHaveClass('text-pink-500')
        })
    })

    it('should draw a tile with the selected color', async () => {
        selectColor(2);
        const { symbolElement } = await findSelectedTile()

        expect(symbolElement).toHaveClass('text-pink-500')

        const aCell = clickCanvasCell(1)

        await waitFor(() => {
            expect(aCell).toHaveTextContent(symbolElement.textContent!)
            expect(symbolElement).toHaveClass('text-pink-500')
        })
    })
})


function selectColor(index: number) {
    const colorPanel = getColorPanel();
    const element = within(colorPanel).getAllByTestId('color-container')[index];
    const radio = within(element).getByTestId('radio');

    userEvent.click(radio);

    return { element }
}

function clickCanvasCell(index: number = 0) {
    const canvas = getCurrentCanvas();
    const aCell = within(canvas).getAllByRole('button')[index];

    userEvent.click(aCell);

    return aCell
}

function selectTile(index: number = 1) {
    const aTile = getTile(index);

    userEvent.click(aTile);

    return aTile;
}

function getTile(index: number) {
    const allTilesPanel = getAllTilesPanel();

    return within(allTilesPanel).getAllByTestId('radio')[index];
}

async function findSelectedTile() {
    const allTilesPanel = getAllTilesPanel();
    const radioElement = await within(allTilesPanel).findByTestId('selected-radio');
    const symbolElement = await within(allTilesPanel).findByTestId('selected-symbol');

    return { radioElement, symbolElement }
}

function assertNumberOfActiveTilesIs(expectedNumber: number) {
    const activeTilesPanel = getActiveTilesPanel();
    const content = within(activeTilesPanel).getByTestId('panel-content');

    expect(content.childElementCount).toBe(expectedNumber);
}

function getToolBar() {
    return screen.getByTestId('toolbar');
}

function getColorPanel() {
    return screen.getByTestId('color-panel');
}

function getCurrentCanvas() {
    return screen.getByTestId('selected-canvas');
}

function getAllTilesPanel() {
    return screen.getByTestId('all-tiles-panel');
}

function getActiveTilesPanel() {
    return screen.getByTestId('active-tiles-panel');
}
