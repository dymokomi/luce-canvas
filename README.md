# luce-canvas

The canvas engine for Luce image editors. A document's pixels live here as
256 × 256 tiles that never change once made: copies share them, a change makes a
new tile, and undo is keeping the old ones.

luce-canvas is being built to keep very large canvases (15000 × 24000 and beyond)
fast on ordinary machines. The design is in luced-2d's
[docs/design/CANVAS-ENGINE.md](https://github.com/dymokomi/luced-2d/blob/main/docs/design/CANVAS-ENGINE.md).

## Modules

- `tiles`: `Tiles`, a layer's grid of shared tiles over its extent, with the cells kept
  past the canvas.
- `half`: IEEE 754 binary16 conversion for `rgba16_float` texels.
- `pyramid`: a store's coarser levels, averaged in premultiplied space, keyed by
  content and made on demand.
- `cache`: derived tiles by content key within a byte budget.
- `keymap`: the hash table behind the cache.

## Testing

```
./test.sh
```

This runs every module's tests on the native and C backends. GPU tests skip themselves
where no device opens.
