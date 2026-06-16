import "@testing-library/jest-dom";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "jotai";
import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import messages from "../../../messages/en.json";
import ColorMenu from "./ColorMenu";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as unknown as { ResizeObserver: unknown }).ResizeObserver =
  ResizeObserverStub;

const renderColorMenu = (props: ComponentProps<typeof ColorMenu> = {}) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <TooltipProvider>
        <Provider>
          <ColorMenu {...props} />
        </Provider>
      </TooltipProvider>
    </NextIntlClientProvider>,
  );

describe("ColorMenu", () => {
  beforeEach(() => {
    renderColorMenu();
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

  it("should start collapsed on mobile and expand when a current swatch is clicked", async () => {
    cleanup();
    renderColorMenu({ isMobile: true });

    expect(screen.getByTestId("selectable-colors").parentElement).toHaveAttribute(
      "hidden",
    );

    await userEvent.click(screen.getByTestId("tile-target"));

    await waitFor(() => {
      expect(screen.getByTestId("selectable-colors").parentElement).not.toHaveAttribute(
        "hidden",
      );
    });
  });
});
