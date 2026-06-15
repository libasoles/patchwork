#!/usr/bin/env python3
"""
Generate smith-tiles.ttf — supplementary font for Patchwork with Smith (1987)
curved Truchet tiles at Unicode Private Use Area codepoints U+E000–U+E001.

Smith (1987) tiles have TWO quarter-circle arcs per tile, covering all four
edge midpoints. This guarantees that any two adjacent tiles always connect,
so random arrangements always produce closed labyrinthine regions.

Font metrics match BIT BLOCKS TTF BRK:
  UPM=1000, hhea ascent=700, descent=0, advance width=700

Arc geometry in a 700×700 tile square:
  Outer radius: 490 (70% of 700)
  Inner radius: 210 (30% of 700)
  Band thickness: 280 units (40% of tile)
  Band center-line radius: 350 = midpoint of each side

Two glyphs:

  U+E000  S-shape:
    Arc 1 at top-right corner (700,700) — connects TOP ↔ RIGHT edges
    Arc 2 at bottom-left corner (0,0)   — connects BOTTOM ↔ LEFT edges

  U+E001  reverse-S:
    Arc 1 at top-left corner (0,700)    — connects TOP ↔ LEFT edges
    Arc 2 at bottom-right corner (700,0) — connects BOTTOM ↔ RIGHT edges

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
OR = 490       # outer radius  (70% of S)
IR = 210       # inner radius  (30% of S)

# Each arc is approximated by a single quadratic bezier per 90° sweep.
# Control point = corner of the bounding square of the arc sector.
# This gives ~5% geometric error, invisible at 40px tile size.


def draw_s_shape(pen):
    """S-shape: arc at top-right corner (S,S) + arc at bottom-left corner (0,0)."""

    # Arc 1 — top-right corner, center (700, 700)
    # Connects: right-edge midpoint ↔ top-edge midpoint
    pen.moveTo((S, S - OR))                        # (700, 210) on right edge
    pen.qCurveTo((S - OR, S - OR), (S - OR, S))   # outer arc to (210, 700) on top edge
    pen.lineTo((S - IR, S))                        # (490, 700) on top edge inner
    pen.qCurveTo((S - IR, S - IR), (S, S - IR))   # inner arc back to (700, 490)
    pen.closePath()

    # Arc 2 — bottom-left corner, center (0, 0)
    # Connects: left-edge midpoint ↔ bottom-edge midpoint
    pen.moveTo((0, OR))                            # (0, 490) on left edge
    pen.qCurveTo((OR, OR), (OR, 0))               # outer arc to (490, 0) on bottom edge
    pen.lineTo((IR, 0))                            # (210, 0) on bottom edge inner
    pen.qCurveTo((IR, IR), (0, IR))               # inner arc back to (0, 210)
    pen.closePath()


def draw_reverse_s(pen):
    """Reverse-S: arc at top-left corner (0,S) + arc at bottom-right corner (S,0)."""

    # Arc 1 — top-left corner, center (0, 700)
    # Connects: top-edge midpoint ↔ left-edge midpoint
    pen.moveTo((OR, S))                            # (490, 700) on top edge
    pen.qCurveTo((OR, S - OR), (0, S - OR))       # outer arc to (0, 210) on left edge
    pen.lineTo((0, S - IR))                        # (0, 490) on left edge inner
    pen.qCurveTo((IR, S - IR), (IR, S))           # inner arc back to (210, 700)
    pen.closePath()

    # Arc 2 — bottom-right corner, center (700, 0)
    # Connects: bottom-edge midpoint ↔ right-edge midpoint
    pen.moveTo((S - OR, 0))                        # (210, 0) on bottom edge
    pen.qCurveTo((S - OR, OR), (S, OR))           # outer arc to (700, 490) on right edge
    pen.lineTo((S, IR))                            # (700, 210) on right edge inner
    pen.qCurveTo((S - IR, IR), (S - IR, 0))       # inner arc back to (490, 0)
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
glyph_order = [".notdef", "smith.0", "smith.1"]
cmap = {
    0xE000: "smith.0",  # S-shape
    0xE001: "smith.1",  # reverse-S
}

glyphs = {
    ".notdef": make_glyph(draw_notdef),
    "smith.0": make_glyph(draw_s_shape),
    "smith.1": make_glyph(draw_reverse_s),
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
