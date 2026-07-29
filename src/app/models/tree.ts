export type FruitType = 'apple' | 'pear' | 'strawberry' | 'cherry' | 'orange' | 'plum';
export const FRUIT_TYPES: FruitType[] = ['apple', 'pear', 'strawberry', 'cherry', 'orange', 'plum'];

export type CellState = 'empty' | 'active' | 'deleted';
export type TreeSize = 'small' | 'normal' | 'big';
export const TREE_SIZES: TreeSize[] = ['small', 'normal', 'big'];

export interface TreeData {
  id: string;
  state: CellState;
  name: string;
  age: number;
  size: TreeSize;
  fruit: FruitType;
  notes: string;
}

export interface GardenState {
  rows: number;
  cols: number;
  trees: TreeData[];
}

export type TreeAgeCategory = 'young' | 'mature' | 'old';

export function getAgeCategory(age: number): TreeAgeCategory {
  if (age <= 5) return 'young';
  if (age <= 15) return 'mature';
  return 'old';
}

export function createEmptyTree(row: number, col: number): TreeData {
  return { id: `${row}-${col}`, state: 'empty', name: '', age: 0, size: 'normal', fruit: 'apple', notes: '' };
}

export function createGarden(rows: number, cols: number): GardenState {
  const trees: TreeData[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      trees.push(createEmptyTree(r, c));
  return { rows, cols, trees };
}
