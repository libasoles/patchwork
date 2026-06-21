# Hacker News — Show HN draft (English)

HN guidelines: the title is just "Show HN: <thing>" with no editorializing. Post the URL as the
main link, then add the context as the first comment. HN posts don't take image attachments, so link
the articles; you can drop the video link in the comment if you want.

**Main link:** https://patchwork.com.ar/articles/douat
(Alternatively submit https://patchwork.com.ar/articles/douat-256-designs and link the other in the comment.)

---

**Title:**

Show HN: Recreating Douat's 1722 "alphabet of tiles", rendered live from letter codes

---

**First comment:**

In 1704 Sébastien Truchet noticed that a single square tile split by a diagonal into two colors,
repeated and rotated, produces an endless variety of patterns. In 1722 Dominique Douat, a Carmelite
friar, wrote a 256-page book that turned this into a notation: each of the four tile orientations
gets a letter (A, B, C, D), so any pattern becomes a grid of letters — four letters, an infinity of
designs.

I transcribed the letter codes from the book and render every design in the browser from those
codes (SVG generated from the grid, nothing scanned). Two pages:

- The story, plus his 72 engraved plates — click any to flip it and read its letters: https://patchwork.com.ar/articles/douat
- The book's closing dictionary of all 4×4×4×4 = 256 two-by-two blocks: https://patchwork.com.ar/articles/douat-256-designs

You can recolor everything live. It's part of a small tile-based drawing toy I build,
https://patchwork.com.ar/ (Next.js, SVG). Happy to answer questions about the encoding or the
transcription.
