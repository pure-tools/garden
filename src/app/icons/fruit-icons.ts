import type { FruitType } from '../models/tree';

export function fruitBadgeSvg(fruit: FruitType): string {
  switch (fruit) {
    case 'apple':
      return `<svg viewBox="0 0 20 20" width="20" height="20">
        <circle cx="10" cy="12" r="6.5" fill="#E74C3C"/>
        <circle cx="10" cy="12" r="6.5" fill="url(#appleShine)" opacity="0.3"/>
        <ellipse cx="10" cy="5.5" rx="3" ry="2" fill="#27AE60"/>
        <rect x="9.2" y="3" width="1.6" height="4" rx="0.8" fill="#6B4226"/>
        <defs><radialGradient id="appleShine" cx="40%" cy="35%"><stop offset="0%" stop-color="white"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
      </svg>`;
    case 'pear':
      return `<svg viewBox="0 0 20 20" width="20" height="20">
        <ellipse cx="10" cy="13" rx="5.5" ry="5.5" fill="#A8D948"/>
        <ellipse cx="10" cy="8" rx="3" ry="4" fill="#A8D948"/>
        <rect x="9.2" y="2" width="1.6" height="3.5" rx="0.8" fill="#6B4226"/>
        <ellipse cx="12" cy="4" rx="2" ry="1.2" fill="#27AE60"/>
      </svg>`;
    case 'strawberry':
      return `<svg viewBox="0 0 20 20" width="20" height="20">
        <path d="M10,18 Q3,10 5,7 Q7,4 10,5 Q13,4 15,7 Q17,10 10,18Z" fill="#E74C3C"/>
        <ellipse cx="8" cy="5" rx="2.5" ry="1.5" fill="#27AE60"/>
        <ellipse cx="12" cy="5" rx="2.5" ry="1.5" fill="#27AE60"/>
        <circle cx="8" cy="10" r="0.6" fill="#F9E04B"/>
        <circle cx="12" cy="11" r="0.6" fill="#F9E04B"/>
        <circle cx="10" cy="13" r="0.6" fill="#F9E04B"/>
        <circle cx="10" cy="9" r="0.6" fill="#F9E04B"/>
      </svg>`;
    case 'cherry':
      return `<svg viewBox="0 0 20 20" width="20" height="20">
        <path d="M10,2 Q6,5 6,10" stroke="#27AE60" stroke-width="1.3" fill="none"/>
        <path d="M10,2 Q14,5 14,10" stroke="#27AE60" stroke-width="1.3" fill="none"/>
        <circle cx="6" cy="13" r="4.2" fill="#C0392B"/>
        <circle cx="14" cy="12.5" r="4.2" fill="#E74C3C"/>
        <circle cx="4.5" cy="11.5" r="1.5" fill="white" opacity="0.25"/>
        <circle cx="12.5" cy="11" r="1.5" fill="white" opacity="0.25"/>
      </svg>`;
    case 'orange':
      return `<svg viewBox="0 0 20 20" width="20" height="20">
        <circle cx="10" cy="11.5" r="7" fill="#F39C12"/>
        <circle cx="10" cy="11.5" r="7" fill="url(#orangeShine)" opacity="0.3"/>
        <circle cx="10" cy="5.5" r="1.8" fill="#E67E22"/>
        <ellipse cx="12" cy="4.5" rx="2.2" ry="1.3" fill="#27AE60"/>
        <defs><radialGradient id="orangeShine" cx="38%" cy="35%"><stop offset="0%" stop-color="white"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
      </svg>`;
    case 'plum':
      return `<svg viewBox="0 0 20 20" width="20" height="20">
        <ellipse cx="10" cy="12" rx="6" ry="6.5" fill="#8E44AD"/>
        <ellipse cx="10" cy="12" rx="6" ry="6.5" fill="url(#plumShine)" opacity="0.3"/>
        <rect x="9.2" y="3" width="1.6" height="4" rx="0.8" fill="#6B4226"/>
        <ellipse cx="12" cy="4" rx="2.5" ry="1.3" fill="#27AE60"/>
        <defs><radialGradient id="plumShine" cx="35%" cy="30%"><stop offset="0%" stop-color="white"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
      </svg>`;
  }
}
