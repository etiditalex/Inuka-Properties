import { mulberry32 } from "@/lib/play/catalog";

const SIZE = 6;
const BOX_ROWS = 2;
const BOX_COLS = 3;

const BASE: number[][] = [
  [0, 1, 2, 3, 4, 5],
  [3, 4, 5, 0, 1, 2],
  [1, 2, 0, 5, 3, 4],
  [4, 5, 3, 1, 2, 0],
  [2, 0, 1, 4, 5, 3],
  [5, 3, 4, 2, 0, 1],
];

export type NumberGrid = number[][];

function clone(grid: NumberGrid): NumberGrid {
  return grid.map((row) => row.slice());
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function permuteRows(grid: NumberGrid, order: number[]): NumberGrid {
  return order.map((index) => grid[index].slice());
}

function permuteCols(grid: NumberGrid, order: number[]): NumberGrid {
  return grid.map((row) => order.map((index) => row[index]));
}

function mapSymbols(grid: NumberGrid, symbols: number[]): NumberGrid {
  return grid.map((row) => row.map((value) => symbols[value]));
}

export function solvedMiniSudoku(seed: number): NumberGrid {
  const rand = mulberry32(seed);
  let grid = clone(BASE);
  grid = mapSymbols(grid, shuffle([0, 1, 2, 3, 4, 5], rand));

  const bandOrder = shuffle([0, 1, 2], rand);
  const rowOrder = bandOrder.flatMap((band) => {
    const start = band * BOX_ROWS;
    return shuffle([start, start + 1], rand);
  });
  grid = permuteRows(grid, rowOrder);

  const stackOrder = shuffle([0, 1], rand);
  const colOrder = stackOrder.flatMap((stack) => {
    const start = stack * BOX_COLS;
    return shuffle([start, start + 1, start + 2], rand);
  });
  return permuteCols(grid, colOrder);
}

function validAt(grid: NumberGrid, row: number, col: number, value: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (grid[row][i] === value || grid[i][col] === value) return false;
  }
  const boxRow = Math.floor(row / BOX_ROWS) * BOX_ROWS;
  const boxCol = Math.floor(col / BOX_COLS) * BOX_COLS;
  for (let r = boxRow; r < boxRow + BOX_ROWS; r++) {
    for (let c = boxCol; c < boxCol + BOX_COLS; c++) {
      if (grid[r][c] === value) return false;
    }
  }
  return true;
}

function countSolutions(grid: NumberGrid, limit = 2): number {
  const next = findEmpty(grid);
  if (!next) return 1;
  const [row, col] = next;
  let found = 0;
  for (let value = 0; value < SIZE; value++) {
    if (!validAt(grid, row, col, value)) continue;
    grid[row][col] = value;
    found += countSolutions(grid, limit - found);
    grid[row][col] = -1;
    if (found >= limit) return found;
  }
  return found;
}

function findEmpty(grid: NumberGrid): [number, number] | null {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (grid[row][col] < 0) return [row, col];
    }
  }
  return null;
}

export function miniSudokuPuzzle(seed: number): { puzzle: NumberGrid; solution: NumberGrid } {
  const solution = solvedMiniSudoku(seed);
  const puzzle = clone(solution);
  const rand = mulberry32(seed ^ 0x51ed);
  const cells = shuffle(
    Array.from({ length: SIZE * SIZE }, (_, index) => index),
    rand
  );
  let removed = 0;
  for (const cell of cells) {
    if (removed >= 16) break;
    const row = Math.floor(cell / SIZE);
    const col = cell % SIZE;
    const saved = puzzle[row][col];
    puzzle[row][col] = -1;
    if (countSolutions(clone(puzzle)) !== 1) puzzle[row][col] = saved;
    else removed++;
  }
  return { puzzle, solution };
}

export function lettersForGrid(grid: NumberGrid, letters: string): string[][] {
  return grid.map((row) => row.map((value) => (value < 0 ? "" : letters[value] || "")));
}

export function sameGrid(left: string[][], right: string[][]): boolean {
  if (left.length !== right.length) return false;
  return left.every((row, rowIndex) => row.every((cell, colIndex) => cell === right[rowIndex]?.[colIndex]));
}
