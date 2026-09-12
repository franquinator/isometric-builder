# isometric-builder

Vanilla JS isometric world builder using PixiJS v8 (via CDN). No build step, no package manager.

## Run

Open `index.html` in a browser (or serve via any static server):
```bash
npx serve .
# or
python -m http.server
```

## Architecture

- **Entry point**: `index.html` loads scripts in order: `perlin.js` → `utils.js` → PixiJS CDN → `mundo.js` → `juego.js`
- **juego.js**: Main app, initializes Pixi, handles input, game loop
- **mundo.js**: `MundoIsometrico` class - isometric grid, block placement/removal, Perlin terrain generation
- **perlin.js**: 2D Perlin noise for terrain height
- **utils.js**: Vector math helpers (unused in current flow)
- **bloque.js**: Minimal `Bloque` class (unused)
- **slime.js**: Empty placeholder

## Key Conventions

- Global variables used throughout (no modules)
- Spanish identifiers (`mundo`, `bloque`, `slime`, `poner`, `quitar`)
- Isometric coordinates: `i` (row), `j` (col), `k` (height)
- Tile size: 64×32, Z-offset: 36px per level (`alto + 4`)
- Z-index sorting: `i + j + k * 100`

## Controls

| Key | Action |
|-----|--------|
| 1 / 2 | Select block type: tierra / piedra |
| Arrows | Move cursor X/Y |
| PgUp / PgDn | Move cursor Z |
| Space | Place block at cursor |
| Delete | Remove block at cursor |

## Assets

Textures loaded via `PIXI.Assets.load()`: `tierra.png`, `piedra.png`, `bedrock.png`, `cubo.png` (cursor)

## Known Quirks

- `screenToIso` has a hardcoded `+2` offset (line 43-44 in mundo.js)
- `bloque.js` and `slime.js` are unused
- `utils.js` functions are defined but not imported anywhere
- No lint/typecheck/test tooling configured