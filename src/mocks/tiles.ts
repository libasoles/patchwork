import { createTile } from "@/factory";

export const mockTiles = [
  { symbol: " ", id: 32, group: "test group" },
  { symbol: "š", id: 353, group: "test group" },
  { symbol: "j", id: 106, group: "test group" },
  { symbol: "k", id: 107, group: "test group" },
  { symbol: "l", id: 108, group: "test group" },
].map((tile) => createTile(tile));
