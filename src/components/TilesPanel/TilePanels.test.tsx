
import { render, screen, waitFor, within } from '@testing-library/react'
import '@testing-library/jest-dom';
import TilePanels from './TilePanels';
import { mockTiles } from '@/mocks/tiles';
import userEvent from '@testing-library/user-event';

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
        it('should display the title and all selectable tiles', async () => {
            const activeTilesPanel = screen.getByTestId('all-tiles-panel')
            const title = within(activeTilesPanel).getByRole('heading')
            expect(title).toHaveTextContent('All Tiles')

            const content = within(activeTilesPanel).getByTestId('panel-content')

            await waitFor(() => {
                const noneWhitespace = /\S/; // no other symbol that " " whitespace
                expect(content.children[0]).not.toContainHTML(noneWhitespace.toString());
                expect(content.children[1]).toHaveTextContent(mockTiles[1].symbol)
                expect(content.children[2]).toHaveTextContent(mockTiles[2].symbol)
                expect(content.children[3]).toHaveTextContent(mockTiles[3].symbol)
            })
        })

        it('should highlight a tile when clicked', async () => {
            const { radioElement, symbolElement } = await getTile(1)

            userEvent.click(radioElement)

            const { radioElement: selectedRadioElement, symbolElement: selectedSymbolElement } = await getSelectedTile()
            expect(selectedSymbolElement).toHaveTextContent(symbolElement.textContent!)
            expect(selectedRadioElement).not.toBeNull()
        })
    })

    // TODO: move functions to test utils
    async function getTile(index: number) {
        const allTilesPanel = screen.getByTestId('all-tiles-panel')
        const radioElement = (await within(allTilesPanel).findAllByTestId('radio'))[index];
        const symbolElement = (await within(allTilesPanel).findAllByTestId('symbol'))[index];

        return { radioElement, symbolElement }
    }

    async function getSelectedTile() {
        // return within(activeTilesPanel).queryByRole('radio', { checked: true });
        const allTilesPanel = await screen.findByTestId('all-tiles-panel')
        const radioElement = await within(allTilesPanel).findByTestId('selected-radio');
        const symbolElement = await within(allTilesPanel).findByTestId('selected-symbol');

        return { radioElement, symbolElement }
    }
})
