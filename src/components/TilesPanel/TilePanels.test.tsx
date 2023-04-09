
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom';
import TilePanels from './TilePanels';
import { mockTiles } from '@/mocks/tiles';

describe('Tile panels', () => {
    beforeEach(() => {
        render(<TilePanels tiles={mockTiles} />)
    })

    describe('active tiles', () => {
        it('should display the title and a single active tiles', async () => {
            const activeTilesPanel = screen.getByTestId('active-tiles-panel')
            const title = within(activeTilesPanel).getByRole('heading')
            expect(title).toHaveTextContent('Active Tiles')

            await waitFor(() => {
                const content = within(activeTilesPanel).getByTestId('panel-content')

                expect(content.childElementCount).toBe(1)
            })
        })
    })

    describe('all tiles', () => {
        it('should display the title and active tiles', async () => {
            const activeTilesPanel = screen.getByTestId('all-tiles-panel')
            const title = within(activeTilesPanel).getByRole('heading')
            expect(title).toHaveTextContent('All Tiles')

            const content = within(activeTilesPanel).getByTestId('panel-content')

            await waitFor(() => {
                expect(content.children[0]).toHaveTextContent(mockTiles[0].symbol)
                expect(content.children[1]).toHaveTextContent(mockTiles[1].symbol)
                expect(content.children[2]).toHaveTextContent(mockTiles[2].symbol)
            })
        })

        // TODO: it('should have the trash icon on first tile', () => {})

        it('should highlight a tile when clicked', async () => {
            const allTilesPanel = screen.getByTestId('all-tiles-panel')
            const aTile = within(allTilesPanel).getAllByRole('radio')[1]

            const selectedTile = getSelectedTile(allTilesPanel)
            expect(selectedTile).toBeNull()

            fireEvent.click(aTile)

            await waitFor(() => {
                const selectedTile = getSelectedTile(allTilesPanel)
                expect(selectedTile).not.toBeNull()
            })
        })
    })
})

function getSelectedTile(activeTilesPanel: HTMLElement) {
    return within(activeTilesPanel).queryByRole('radio', { checked: true });
}
