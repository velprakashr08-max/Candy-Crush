// Candy types available in the game
const CANDY_TYPES = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'];

// Level definitions
const LEVELS = [
    {id: 1, name: 'Sweet Start', rows: 8, cols: 8, target: 1500, moves: 30, colors: ['Red', 'Blue', 'Green', 'Yellow'], specialsEnabled: true, blockers: 0, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 2, name: 'Candy Storm', rows: 8, cols: 8, target: 3000, moves: 28, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'], specialsEnabled: true, blockers: 3, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 3, name: 'Sugar Rush', rows: 8, cols: 8, target: 5000, moves: 30, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'], specialsEnabled: true, blockers: 5, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 4, name: 'Jelly Jam', rows: 8, cols: 8, target: 7000, moves: 28, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'], specialsEnabled: true, blockers: 7, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 5, name: 'Candy Blizzard', rows: 8, cols: 8, target: 9000, moves: 28, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'], specialsEnabled: true, blockers: 8, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 6, name: 'Neon Sweets', rows: 8, cols: 8, target: 12000, moves: 25, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'], specialsEnabled: true, blockers: 10, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 7, name: 'Rainbow Road', rows: 8, cols: 8, target: 15000, moves: 25, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'], specialsEnabled: true, blockers: 10, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 8, name: 'Sugar Fiesta', rows: 8, cols: 8, target: 18000, moves: 23, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'], specialsEnabled: true, blockers: 12, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 9, name: 'Candy Chaos', rows: 8, cols: 8, target: 22000, moves: 22, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'], specialsEnabled: true, blockers: 13, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 10, name: 'Sugar Peak', rows: 8, cols: 8, target: 28000, moves: 20, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'], specialsEnabled: true, blockers: 15, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 11, name: 'Candy Kingdom', rows: 8, cols: 8, target: 35000, moves: 20, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'], specialsEnabled: true, blockers: 17, star1: 0.33, star2: 0.66, star3: 1.0},
    {id: 12, name: 'Sweet Apocalypse', rows: 8, cols: 8, target: 45000, moves: 18, colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'], specialsEnabled: true, blockers: 20, star1: 0.33, star2: 0.66, star3: 1.0}
];

// Color mapping for effects
const COLOR_MAP = {
    Red: '#ef4444', 
    Blue: '#3b82f6', 
    Green: '#22c55e',
    Yellow: '#facc15', 
    Orange: '#f97316', 
    Purple: '#a855f7'
};

// Sound effects configuration
const SOUNDS = {
    select: {f: 600, t: 'sine', d: 0.1, v: 0.15},
    swap: {f: 500, t: 'triangle', d: 0.15, v: 0.12},
    match: {f: 800, t: 'sine', d: 0.2, v: 0.15},
    bigMatch: {f: 1000, t: 'square', d: 0.25, v: 0.12},
    special: {f: 1200, t: 'sawtooth', d: 0.35, v: 0.1},
    combo: {f: 900, t: 'sine', d: 0.3, v: 0.14},
    noMatch: {f: 250, t: 'square', d: 0.2, v: 0.1},
    victory: {f: 523, t: 'sine', d: 0.8, v: 0.15},
    gameOver: {f: 200, t: 'sawtooth', d: 0.6, v: 0.1},
    click: {f: 440, t: 'sine', d: 0.08, v: 0.1},
    hint: {f: 700, t: 'triangle', d: 0.15, v: 0.12},
    shuffle: {f: 350, t: 'square', d: 0.2, v: 0.1},
    star: {f: 1100, t: 'sine', d: 0.3, v: 0.12},
    colorBomb: {f: 300, t: 'sawtooth', d: 0.5, v: 0.13},
};

// Powerup types
const POWERUPS = {
    ROW_BLAST: 'rowBlast',
    COL_BLAST: 'colBlast',
    WRAPPED_BLAST: 'wrappedBlast',
    COLOR_BOMB: 'colorBomb',
    EXTRA_MOVES: 'extraMoves'
};

// Special candy types
const SPECIALS = {
    STRIPED_H: 'striped-h',
    STRIPED_V: 'striped-v',
    WRAPPED: 'wrapped',
    COLOR_BOMB: 'color-bomb'
};

// Direction vectors
const DIRECTIONS = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
];