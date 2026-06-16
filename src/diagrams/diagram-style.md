# Amber Diagram Style Spec

Reference for post-processing Excalidraw SVG exports. Covers two passes: deterministic normalization and alignment correction.

## Palette

```
panel-bg:       #0f172a
surface:        #1e293b
surface-2:      #334155
connector:      #475569
muted:          #64748b
secondary-text: #94a3b8
border-soft:    #cbd5e1
text-strong:    #e2e8f0
text-primary:   #f8fafc

amber:          #f59e0b
amber-light:    #fbbf24
amber-soft:     #fcd34d
violet:         #8b5cf6
violet-soft:    #a78bfa
success:        #10b981
success-soft:   #34d399
error:          #ef4444
error-soft:     #f87171
```

Accent colors carry semantic meaning — do not substitute or introduce new colors.

## Typography

Font sizes (px):

| Role | Size |
|---|---|
| page title | 32 |
| section / hero title | 22–26 |
| card title | 16–18 |
| body | 13–14 |
| caption / label | 11–12 |
| mono / code label | 12–13 |

Normalization target — replace all Excalidraw-exported font families (Helvetica, Arial, Nunito, or any other) with:

```
ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
```

## Geometry

- stroke-width: `1`
- corners: rounded, small radius
- fills: flat only (no gradients, shadows, or decorative effects)
- solid lines: normal flows
- dashed lines: exception paths, retries, secondary annotations only
- no mixed border weights unless semantically required

## SVG normalization

Safe changes:
- Standardize `font-family` to the canonical stack
- Snap font sizes to the approved ladder
- Normalize stroke widths to `1` (unless the role is emphasized)
- Normalize color tokens to the palette
- Remove export noise and unstable metadata
- Fix local text or icon placement (see Alignment below)

Unsafe changes — flag for human review instead:
- Moving boxes
- Rerouting arrows
- Reflowing composition
- Rewriting icon geometry
- Changing semantic emphasis

## Alignment correction

Only fix issues that are obviously local and visually minor. Anything requiring composition judgment should be reported, not silently changed.

### Card rows

Cards in the same horizontal row should share a common top edge.

1. Group cards into rows by overlapping Y ranges.
2. For each row, identify the minimum `ty` (the topmost card is the reference point).
3. For each card that doesn't share that `ty`, compute `ΔY = target_ty − card_ty`.
4. Apply `ΔY` to:
   - the card's own group transform
   - all text label group transforms belonging to that card
   - the status icon group transform for that card

Excalidraw group transforms take the form `translate(tx ty) rotate(0 cx cy)`. Only change `ty`; leave everything else untouched.

### Status icons

Status icons (checkmarks, alert circles, error crosses) should sit a consistent distance above the card top edge.

```
icon_ty = card_ty − ICON_OFFSET
```

Derive `ICON_OFFSET` from a correctly positioned icon already in the diagram (typically 13–14 px). Apply that same offset to every icon in the row. If icons in a row have inconsistent offsets after the card shift, move them to the derived target.

### Horizontal text centering

Text labels inside cards should be horizontally centered.

Check: `text_tx + text_half_width ≈ card_tx + card_half_width`

If the error is more than ~2 px, correct it:

```
new_text_tx = card_tx + card_half_width − text_half_width
```

`card_half_width` and `text_half_width` are the `cx` values from each element's `rotate(0 cx cy)` transform.

### Arrows between cards

After top-aligning a card row, recalculate horizontal arrow Y positions.

```
card_center_y   = card_ty + card_half_height   (card_half_height = cy from the card's rotate)
arrow_y         = (left_card_center_y + right_card_center_y) / 2
```

Apply the new `ty` to the arrow's group transform. If the line and arrowhead are in separate groups that share the same transform, both need updating.

### Section headers

Headers labeling the same column or row group should share the same `tx`. Derive the target from the first header; align the rest to it.

## Quick-check before reporting done

- [ ] All `font-family` attributes use the canonical stack
- [ ] Cards in each row share the same top edge (`ty`)
- [ ] Status icons are consistently positioned above their card tops (uniform `ICON_OFFSET`)
- [ ] Text labels are horizontally centered within their cards
- [ ] Arrow `ty` values updated to card midpoints after row alignment
- [ ] Section headers are left-aligned at a consistent `tx`
- [ ] No structural elements moved, rerouted, or rescaled
