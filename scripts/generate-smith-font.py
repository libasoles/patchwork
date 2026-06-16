#!/usr/bin/env python3
"""
Generate smith-tiles.ttf — supplementary font for Patchwork with Smith (1987)
Truchet tiles, at Unicode Private Use Area codepoints U+E000–U+E015.

Three tile styles, each provided in TWO stroke weights (thin + thick):

  arcs            quarter-circle connectors covering all four edge midpoints
  diagonal lines  straight double-band variant of the arcs (Patchwork addition)
  single diagonal Smith's canonical "retain only the diagonal line" variant —
                  one corner-to-corner diagonal, two orientations (paper Fig. 3)

The arc and diagonal-line tiles carry TWO connectors per tile, covering all four
edge midpoints, so any two adjacent tiles always connect — producing the closed
labyrinthine regions Smith described. The single-diagonal tiles are the classic
two-orientation diagonal Truchet tile.

Font metrics match BIT BLOCKS TTF BRK:
  UPM=1000, hhea ascent=700, descent=0, advance width=700

Stroke weights (700×700 tile square, bands centred on the edge midpoint 350):

  thin   ~50-unit band  — the original Patchwork weight, kept unchanged
  thick  175-unit perpendicular stroke — matches the BIT BLOCKS glyph weight
         (175 units = 25% of the 700 box) for visual cohesion with the rest of
         the catalog.

Codepoint layout:

  thin                          thick
  U+E000 arc S                  U+E010 arc S
  U+E001 arc reverse-S          U+E011 arc reverse-S
  U+E002 double-band S          U+E012 double-band S
  U+E003 double-band reverse-S  U+E013 double-band reverse-S
  U+E004 single diagonal /      U+E014 single diagonal /
  U+E005 single diagonal \\      U+E015 single diagonal \\
"""

import math
import os
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

# ── Geometry constants ──────────────────────────────────────────────────────
UPM    = 1000
ASCENT = 700
ADV    = 700   # advance width

S = 700        # tile square side length (matches BIT BLOCKS glyph box)

# Arc / double-band radii per weight. Bands are centred on the edge midpoint 350.
#   arcs:        radial band width  = OR - IR
#   double-band: edge crossings at  (S - OR) and (S - IR)
# thin keeps the original 50-unit values; thick uses a 175-unit perpendicular
# stroke (arcs radial 175; double-band edge span 175·√2 ≈ 247 → crossings 226/474).
THIN  = {"OR": 375, "IR": 325, "OR_DB": 375, "IR_DB": 325, "A": round(50 / math.sqrt(2))}
THICK = {"OR": 438, "IR": 263, "OR_DB": 474, "IR_DB": 226, "A": round(175 / math.sqrt(2))}

# Each arc is approximated by a single quadratic bezier per 90° sweep.
# Control point = corner of the bounding square of the arc sector.
# This gives ~2% geometric error, invisible at 40px tile size.


def draw_s_shape(pen, OR, IR):
    """S-shape: arc at top-right corner (S,S) + arc at bottom-left corner (0,0)."""

    # Arc 1 — top-right corner, center (700, 700)
    # Connects: right-edge midpoint ↔ top-edge midpoint
    pen.moveTo((S, S - OR))
    pen.qCurveTo((S - OR, S - OR), (S - OR, S))   # outer arc to top edge
    pen.lineTo((S - IR, S))
    pen.qCurveTo((S - IR, S - IR), (S, S - IR))   # inner arc back to right edge
    pen.closePath()

    # Arc 2 — bottom-left corner, center (0, 0)
    # Connects: left-edge midpoint ↔ bottom-edge midpoint
    pen.moveTo((0, OR))
    pen.qCurveTo((OR, OR), (OR, 0))               # outer arc to bottom edge
    pen.lineTo((IR, 0))
    pen.qCurveTo((IR, IR), (0, IR))               # inner arc back to left edge
    pen.closePath()


def draw_reverse_s(pen, OR, IR):
    """Reverse-S: arc at top-left corner (0,S) + arc at bottom-right corner (S,0)."""

    # Arc 1 — top-left corner, center (0, 700)
    # Connects: top-edge midpoint ↔ left-edge midpoint
    pen.moveTo((OR, S))
    pen.qCurveTo((OR, S - OR), (0, S - OR))       # outer arc to left edge
    pen.lineTo((0, S - IR))
    pen.qCurveTo((IR, S - IR), (IR, S))           # inner arc back to top edge
    pen.closePath()

    # Arc 2 — bottom-right corner, center (700, 0)
    # Connects: bottom-edge midpoint ↔ right-edge midpoint
    pen.moveTo((S - OR, 0))
    pen.qCurveTo((S - OR, OR), (S, OR))           # outer arc to right edge
    pen.lineTo((S, IR))
    pen.qCurveTo((S - IR, IR), (S - IR, 0))       # inner arc back to bottom edge
    pen.closePath()


# Straight double bands. Each band is the strip clipped to the tile between two
# parallel diagonals, crossing each edge between (S-OR) and (S-IR), centred on
# 350, so it connects flush with the arc tiles.

def draw_straight_s(pen, OR, IR):
    """Straight S: diagonal band top↔right + diagonal band bottom↔left."""

    # Top-right band
    pen.moveTo((S - OR, S))
    pen.lineTo((S - IR, S))
    pen.lineTo((S, S - IR))
    pen.lineTo((S, S - OR))
    pen.closePath()

    # Bottom-left band
    pen.moveTo((IR, 0))
    pen.lineTo((OR, 0))
    pen.lineTo((0, OR))
    pen.lineTo((0, IR))
    pen.closePath()


def draw_straight_reverse_s(pen, OR, IR):
    """Straight reverse-S: diagonal band top↔left + diagonal band bottom↔right."""

    # Top-left band
    pen.moveTo((0, IR))
    pen.lineTo((OR, S))
    pen.lineTo((S - OR, S))
    pen.lineTo((0, OR))
    pen.closePath()

    # Bottom-right band
    pen.moveTo((IR, 0))
    pen.lineTo((S, OR))
    pen.lineTo((S, IR))
    pen.lineTo((OR, 0))
    pen.closePath()


# Single corner-to-corner diagonal (Smith Fig. 3). One band straddling the tile
# diagonal, clipped to the square (a hexagonal strip). `a` is the band's offset
# along an edge from the diagonal; perpendicular stroke width = a·√2.

def draw_single_slash(pen, a):
    """Single "/" diagonal along y = x (bottom-left ↔ top-right corners)."""
    pen.moveTo((a, 0))
    pen.lineTo((S, S - a))
    pen.lineTo((S - a, S))
    pen.lineTo((0, a))
    pen.closePath()


def draw_single_backslash(pen, a):
    """Single "\\" diagonal along x + y = S (top-left ↔ bottom-right corners)."""
    pen.moveTo((0, S - a))
    pen.lineTo((S - a, 0))
    pen.lineTo((S, a))
    pen.lineTo((a, S))
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
# (codepoint, glyph name, draw lambda) for each weight.
def weight_glyphs(prefix, base_cp, w):
    return [
        (base_cp + 0x0, f"{prefix}.0", lambda p: draw_s_shape(p, w["OR"], w["IR"])),
        (base_cp + 0x1, f"{prefix}.1", lambda p: draw_reverse_s(p, w["OR"], w["IR"])),
        (base_cp + 0x2, f"{prefix}.2", lambda p: draw_straight_s(p, w["OR_DB"], w["IR_DB"])),
        (base_cp + 0x3, f"{prefix}.3", lambda p: draw_straight_reverse_s(p, w["OR_DB"], w["IR_DB"])),
        (base_cp + 0x4, f"{prefix}.4", lambda p: draw_single_slash(p, w["A"])),
        (base_cp + 0x5, f"{prefix}.5", lambda p: draw_single_backslash(p, w["A"])),
    ]


entries = weight_glyphs("smith_thin", 0xE000, THIN) + weight_glyphs("smith_thick", 0xE010, THICK)

glyph_order = [".notdef"] + [name for _, name, _ in entries]
cmap = {cp: name for cp, name, _ in entries}
glyphs = {".notdef": make_glyph(draw_notdef)}
for _, name, draw in entries:
    glyphs[name] = make_glyph(draw)

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
print(f"Saved: {os.path.abspath(out_path)} ({len(glyph_order)} glyphs incl .notdef)")
