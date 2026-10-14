# DESIGN.md — Implementation Guide

CLAUDE.md is the philosophy: why this project looks and feels the way it does.
This file is the implementation: what to actually do, in what order, with what to check before shipping.

Read both. If they ever seem to disagree, CLAUDE.md wins on *why*, this file wins on *how* — and if that gap shows up, it means one of the two needs fixing (see Final Review below).

## Before touching a section: the build order

Work through these five in order, on every section, every time. Do not skip ahead to effects because a composition feels unfinished — an unfinished composition is not fixed by an effect, it's fixed by going back to step 1.

1. **Composition** — where does the eye land first, second, third? Is there one focal point or is attention split?
2. **Layout** — spacing, grid, rhythm. Does the section breathe? Is whitespace doing work?
3. **Photography** — is the image doing the heavy lifting? Would this section survive with a worse photo, or is the photo compensating for a weak layout?
4. **Typography** — hierarchy through size and weight, not decoration. Can you tell what matters most without color or effects?
5. **Materials** — does the surface read as something physical (stone, paper, bronze, glass) or as a UI panel?

Only once all five hold up on their own — no gradients, no blur, no glow turned on — should you consider effects at all. If the section looks unfinished with effects switched off, the problem is upstream, not at the effects layer.

## The two questions to ask before adding any effect

1. **"Does this exist elsewhere in the project?"** is not a reason to add it here. Every section is judged on its own. A hero dissolve on the homepage does not justify a hero dissolve on the Mountains page — see No Global Visual Rules in CLAUDE.md.
2. **"Am I adding this because the composition is weak?"** If yes, stop and fix the composition instead. Effects are the last 10% of a section that already works, never the first 10% of one that doesn't.

## Good vs. bad, concretely

### Spacing

**GOOD** — one section, one idea, generous padding around it; a card grid where cards are allowed different heights when content differs; a divider that's a hairline or a gap, not a colored block.

**BAD** — compressing padding to fit one more line of copy; forcing equal-height cards with padding hacks; filling "empty" space with a decorative shape because it "felt bare" (the fix is better composition, not filler).

### Photography

**GOOD** — a large, real photograph carrying a section on its own, with UI reduced to a title and one link; a photo that's allowed to be quiet (no overlay) when the text sits beside it instead of on top of it.

**BAD** — a stock-feeling image propped up by a heavy gradient scrim because the shot itself is weak; the same darkening treatment pasted onto every photo regardless of what the photo actually needs.

### Editorial composition

**GOOD** — a hero where the title sits in the one open area of the frame the photograph already offers; a card whose CTA is the natural conclusion of the copy above it, not a button bolted onto a template.

**BAD** — text placed dead-center by default and only nudged if it happens to collide with something; a layout copy-pasted from another page and then adjusted until it "sort of" fits the new photo.

### Restrained materials

**GOOD** — one accent color per section, used once, meaningfully (a link, a label); a card that reads as lacquered wood or cast bronze because of how light catches one edge, not because of a blur filter.

**BAD** — glassmorphism / frosted-blur panels used as a default card style; the same neumorphic shadow recipe copied onto every container regardless of what material it's supposed to be.

### Minimal effects

**GOOD** — a single soft shadow that implies real depth; grain used once, at an intensity so low it reads as material, not decoration; motion that only fires on a state change (hover, reveal) and settles.

**BAD** — stacking glow + blur + gradient + shadow on the same element "to be safe"; an animation that loops forever with no trigger; an effect kept in because removing it felt like doing less work, not because it earns its place.

## Section transitions, specifically

Since this has been a recurring point of drift:

- A transition between two sections is a decision made **for that specific pair of sections**, not a system applied site-wide.
- Default to a clean cut: Section A ends, Section B begins, on their own flat materials/colors.
- Only add a dissolve, fade, or bridging gradient when you can name the specific composition problem it solves (e.g., a photograph's horizon line collides badly with a hard color edge). If you can't name the problem, don't add the effect.
- Never build a shared "hand-off" mechanism (matching gradient stops, mask dissolves keyed to the next section's color) meant to apply automatically everywhere. That's the exact pattern CLAUDE.md's Section Transitions rule forbids.

## Final review

Before calling a design task done, re-read CLAUDE.md's Hero System, Section Transitions, and Card System sections against what you actually built. Specifically check:

- Nothing here was justified by "it matches the rest of the site" alone — each choice should also survive being asked "does this composition need it?"
- No section transition was applied automatically; each one (or each honest cut) was a decision.
- Effects are the last layer you added, not the first, and the section would still mostly work with them turned off.

If you find a contradiction between this file and CLAUDE.md while doing this check, fix the contradiction before shipping — don't let the two documents quietly disagree.
