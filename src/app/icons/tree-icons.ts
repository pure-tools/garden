import type { TreeAgeCategory, TreeSize } from '../models/tree';

const TREE_COLORS: Record<TreeAgeCategory, string> = {
  young: '#4CAF50',
  mature: '#DAA520',
  old: '#795548',
};

const TREE_SCALE: Record<TreeSize, number> = {
  small: 0.55,
  normal: 0.78,
  big: 1.0,
};

export function treeIconSvg(ageCategory: TreeAgeCategory, size: TreeSize): string {
  const color = TREE_COLORS[ageCategory];
  const s = TREE_SCALE[size];
  const sw = 2.5;
  return `<svg viewBox="0 0 64 80" width="64" height="80" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(32,40) scale(${s}) translate(-32,-40)">
      <line x1="32" y1="52" x2="32" y2="72" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="20" fill="none" stroke="${color}" stroke-width="${sw}"/>
      <line x1="32" y1="15" x2="32" y2="49" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M32,20 Q22,26 18,36" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M32,20 Q42,26 46,36" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M32,30 Q24,36 22,44" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M32,30 Q40,36 42,44" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
    </g>
  </svg>`;
}
