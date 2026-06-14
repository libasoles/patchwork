import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import messages from "../../../messages/en.json";
import ColorMenu from "./ColorMenu";

describe("ColorMenu", () => {
  beforeEach(() => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <TooltipProvider>
          <Provider>
            <ColorMenu />
          </Provider>
        </TooltipProvider>
      </NextIntlClientProvider>,
    );
  });

  it("should display both target swatches and the selected tile color", () => {
    const panel = screen.getByTestId("color-panel");

    expect(within(panel).getByTestId("tile-target")).toBeInTheDocument();
    expect(within(panel).getByTestId("bg-target")).toBeInTheDocument();
    expect(within(panel).getByTestId("selected-color")).toBeInTheDocument();
    expect(within(panel).getByTestId("selected-bg-color")).toBeInTheDocument();
  });

  it("should show all 16 tile colors by default", () => {
    const list = screen.getByTestId("selectable-colors");
    const swatches = within(list).getAllByTestId("color-circle");
    expect(swatches).toHaveLength(16);
  });

  it("should switch to the background palette when the bg target is clicked", async () => {
    userEvent.click(screen.getByTestId("bg-target"));

    await waitFor(() => {
      const list = screen.getByTestId("selectable-colors");
      const swatches = within(list).getAllByTestId("color-circle");
      expect(swatches).toHaveLength(4);
    });
  });

  it("should mark the bg target as pressed once selected", async () => {
    const bgTarget = screen.getByTestId("bg-target");
    expect(bgTarget).toHaveAttribute("aria-pressed", "false");

    userEvent.click(bgTarget);

    await waitFor(() => {
      expect(bgTarget).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByTestId("tile-target")).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });
  });
});
