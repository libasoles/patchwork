#!/usr/bin/env python3
"""
Generate smith-tiles.ttf — supplementary font for Patchwork with Smith (1987)
curved Truchet tiles plus their straight (diagonal double-line) counterparts, at
Unicode Private Use Area codepoints U+E000–U+E003.

Smith (1987) tiles carry TWO connectors per tile, covering all four edge
midpoints. This guarantees that any two adjacent tiles always connect, so random
arrangements always produce closed labyrinthine regions. The straight variants
replace the quarter-circle arcs with straight diagonal bands across the same two
corners, producing the classic diagonal double-line Truchet look.

Font metrics match BIT BLOCKS TTF BRK:
  UPM=1000, hhea ascent=700, descent=0, advance width=700

All connectors cross each edge between 300 and 400 (a 100-unit band centred on
the edge midpoint at 350), so curved and straight tiles connect interchangeably.

Arc geometry in a 700×700 tile square:
  Outer radius: 400, Inner radius: 300  → 100-unit band centred on radius 350.

Four glyphs:

  U+E000  S-shape (arcs):           top↔right + bottom↔left
  U+E001  reverse-S (arcs):         top↔left + bottom↔right
  U+E002  straight S (diagonals):   top↔right + bottom↔left
  U+E003  straight reverse-S:       top↔left + bottom↔right

Every tile covers all 4 edge midpoints → any adjacent pair always connects.
"""

import os
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

# ── Geometry constants ──────────────────────────────────────────────────────
UPM    = 1000
ASCENT = 700
ADV    = 700   # advance width

S  = 700       # tile square side length (matches BIT BLOCKS glyph box)
OR = 400       # outer radius  (band outer edge, crosses each side at 700-OR=300)
IR = 300       # inner radius  (band inner edge, crosses each side at 700-IR=400)

# Each arc is approximated by a single quadratic bezier per 90° sweep.
# Control point = corner of the bounding square of the arc sector.
# This gives ~2% geometric error, invisible at 40px tile size.


def draw_s_shape(pen):
    """S-shape: arc at top-right corner (S,S) + arc at bottom-left corner (0,0)."""

    # Arc 1 — top-right corner, center (700, 700)
    # Connects: right-edge midpoint ↔ top-edge midpoint
    pen.moveTo((S, S - OR))                        # (700, 300) on right edge
    pen.qCurveTo((S - OR, S - OR), (S - OR, S))   # outer arc to (300, 700) on top edge
    pen.lineTo((S - IR, S))                        # (400, 700) on top edge inner
    pen.qCurveTo((S - IR, S - IR), (S, S - IR))   # inner arc back to (700, 400)
    pen.closePath()

    # Arc 2 — bottom-left corner, center (0, 0)
    # Connects: left-edge midpoint ↔ bottom-edge midpoint
    pen.moveTo((0, OR))                            # (0, 400) on left edge
    pen.qCurveTo((OR, OR), (OR, 0))               # outer arc to (400, 0) on bottom edge
    pen.lineTo((IR, 0))                            # (300, 0) on bottom edge inner
    pen.qCurveTo((IR, IR), (0, IR))               # inner arc back to (0, 300)
    pen.closePath()


def draw_reverse_s(pen):
    """Reverse-S: arc at top-left corner (0,S) + arc at bottom-right corner (S,0)."""

    # Arc 1 — top-left corner, center (0, 700)
    # Connects: top-edge midpoint ↔ left-edge midpoint
    pen.moveTo((OR, S))                            # (400, 700) on top edge
    pen.qCurveTo((OR, S - OR), (0, S - OR))       # outer arc to (0, 300) on left edge
    pen.lineTo((0, S - IR))                        # (0, 400) on left edge inner
    pen.qCurveTo((IR, S - IR), (IR, S))           # inner arc back to (300, 700)
    pen.closePath()

    # Arc 2 — bottom-right corner, center (700, 0)
    # Connects: bottom-edge midpoint ↔ right-edge midpoint
    pen.moveTo((S - OR, 0))                        # (300, 0) on bottom edge
    pen.qCurveTo((S - OR, OR), (S, OR))           # outer arc to (700, 400) on right edge
    pen.lineTo((S, IR))                            # (700, 300) on right edge inner
    pen.qCurveTo((S - IR, IR), (S - IR, 0))       # inner arc back to (400, 0)
    pen.closePath()


# Straight diagonal bands. Each band is the strip clipped to the tile between two
# parallel diagonals, crossing each edge between 300 and 400 (centred on 350) so
# it connects flush with the arc tiles.

def draw_straight_s(pen):
    """Straight S: diagonal band top↔right + diagonal band bottom↔left."""

    # Top-right band: between x+y=1000 and x+y=1100
    pen.moveTo((S - OR, S))                        # (300, 700) top edge
    pen.lineTo((S - IR, S))                        # (400, 700) top edge
    pen.lineTo((S, S - IR))                        # (700, 400) right edge
    pen.lineTo((S, S - OR))                        # (700, 300) right edge
    pen.closePath()

    # Bottom-left band: between x+y=300 and x+y=400
    pen.moveTo((IR, 0))                            # (300, 0) bottom edge
    pen.lineTo((OR, 0))                            # (400, 0) bottom edge
    pen.lineTo((0, OR))                            # (0, 400) left edge
    pen.lineTo((0, IR))                            # (0, 300) left edge
    pen.closePath()


def draw_straight_reverse_s(pen):
    """Straight reverse-S: diagonal band top↔left + diagonal band bottom↔right."""

    # Top-left band: between y-x=300 and y-x=400
    pen.moveTo((0, IR))                            # (0, 300) left edge
    pen.lineTo((OR, S))                            # (400, 700) top edge
    pen.lineTo((S - OR, S))                        # (300, 700) top edge
    pen.lineTo((0, OR))                            # (0, 400) left edge
    pen.closePath()

    # Bottom-right band: between x-y=300 and x-y=400
    pen.moveTo((IR, 0))                            # (300, 0) bottom edge
    pen.lineTo((S, OR))                            # (700, 400) right edge
    pen.lineTo((S, IR))                            # (700, 300) right edge
    pen.lineTo((OR, 0))                            # (400, 0) bottom edge
    pen.closePath()


def draw_notdef(pen):
    """Empty .notdef box."""
    pen.moveTo((50, 0))
    pen.lineTo((650, 0))
    pen.lineTo((650, 700))
    pen.lineTo((50, 700))
    pen.closePath()


def make_glyph(draw_fn):
    pen = TTGlyphPen(None)
    draw_fn(pen)
    return pen.glyph()


# ── Build font ───────────────────────────────────────────────────────────────
glyph_order = [".notdef", "smith.0", "smith.1", "smith.2", "smith.3"]
cmap = {
    0xE000: "smith.0",  # S-shape (arcs)
    0xE001: "smith.1",  # reverse-S (arcs)
    0xE002: "smith.2",  # straight S (diagonals)
    0xE003: "smith.3",  # straight reverse-S (diagonals)
}

glyphs = {
    ".notdef": make_glyph(draw_notdef),
    "smith.0": make_glyph(draw_s_shape),
    "smith.1": make_glyph(draw_reverse_s),
    "smith.2": make_glyph(draw_straight_s),
    "smith.3": make_glyph(draw_straight_reverse_s),
}

metrics = {name: (ADV, 0) for name in glyph_order}

fb = FontBuilder(UPM, isTTF=True)
fb.setupGlyphOrder(glyph_order)
fb.setupCharacterMap(cmap)
fb.setupGlyf(glyphs)
fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=ASCENT, descent=0)
fb.setupNameTable({
    "familyName": "Smith Tiles",
    "styleName": "Regular",
})
fb.setupOS2(
    sTypoAscender=750,
    sTypoDescender=-170,
    sTypoLineGap=0,
    usWinAscent=ASCENT,
    usWinDescent=0,
    sxHeight=500,
    sCapHeight=700,
    fsType=0,
    fsSelection=0x40,
    achVendID="PTCH",
    ulUnicodeRange1=0,
    ulUnicodeRange2=0,
    ulUnicodeRange3=0,
    ulUnicodeRange4=0,
    ulCodePageRange1=0x00000001,
    ulCodePageRange2=0,
)
fb.setupPost()
fb.setupHead(unitsPerEm=UPM)

out_path = os.path.join(
    os.path.dirname(__file__),
    "..", "public", "smith-tiles.ttf"
)
fb.font.save(out_path)
print(f"Saved: {os.path.abspath(out_path)}")
