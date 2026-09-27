# luce-canvas

The canvas engine for Luce image editors. A document's pixels live here as
256 × 256 tiles that never change once made: copies share them, a change makes a
new tile, and undo is keeping the old ones.

luce-canvas is being built to keep very large canvases (15000 × 24000 and beyond)
fast on ordinary machines. The design is in luced-2d's
[docs/design/CANVAS-ENGINE.md](https://github.com/dymokomi/luced-2d/blob/main/docs/design/CANVAS-ENGINE.md).

## Modules

- `tiles`: `Tiles`, a layer's grid of shared tiles over its extent, with the cells kept
  past the canvas. Each tile lives on the GPU, in RAM, or both, and a governor keeps
  both within budgets:
  - `residency_configure(device, usage)` budgets a share of the device's and the
    machine's memory;
  - `residency_advance()` starts a frame (tiles handed out since are pinned);
  - `residency_begin_marking()` and `residency_mark_live(tiles)` say what documents
    show;
  - `residency_settle(device)` moves the least wanted tiles to RAM;
  - `tile_texture(device)` makes a tile, making room when the device is full;
  - `residency_report()` tells what each tier holds.
- `wake`: `set_wake(callback)` registers what wakes the app's frame loop
  (its window's wake) and `wake_frames()` calls it from any thread, so work
  finished on a worker is taken in at once; the engine never talks to a window.
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
