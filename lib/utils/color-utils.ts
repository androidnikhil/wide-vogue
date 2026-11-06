export interface ColorOption {
  name: string;
  hex: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  { name: 'Black', hex: '#111111' },
  { name: 'Yellow', hex: '#FFD700' },
  { name: 'Red', hex: '#E53E3E' },
  { name: 'Green', hex: '#38A169' },
  { name: 'Pink', hex: '#ED64A6' },
  { name: 'Orange', hex: '#DD6B20' },
  { name: 'Sky Blue', hex: '#63B3ED' },
  { name: 'Dark Blue', hex: '#2B6CB0' },
  { name: 'White', hex: '#F7FAFC' },
  { name: 'Purple', hex: '#805AD5' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Gold', hex: '#D69E2E' },
  { name: 'Silver', hex: '#CBD5E1' },
  { name: 'Multicolor', hex: 'linear-gradient(135deg, #FFD700, #E53E3E, #38A169, #2B6CB0)' },
];

/**
 * Extracts or resolves the CSS background (hex or gradient) from any color string.
 * Supports:
 * - "Black" -> "#111111"
 * - "Jet Black (#000000)" -> "#000000"
 * - "#3b82f6" -> "#3b82f6"
 */
export const getColorHex = (colorStr: string): string => {
  if (!colorStr) return '#A0AEC0';
  const clean = colorStr.trim();

  // If contains (#HEX)
  const hexParenthesisMatch = clean.match(/\((#[0-9a-fA-F]{3,8})\)/);
  if (hexParenthesisMatch) return hexParenthesisMatch[1];

  // If is pure HEX code
  if (/^#[0-9a-fA-F]{3,8}$/.test(clean)) return clean;

  // Check preset list
  const match = COLOR_OPTIONS.find((c) => c.name.toLowerCase() === clean.toLowerCase());
  if (match) return match.hex;

  // Common CSS named colors fallback
  const cssColors: Record<string, string> = {
    black: '#111111',
    white: '#FFFFFF',
    red: '#E53E3E',
    green: '#38A169',
    blue: '#2B6CB0',
    yellow: '#FFD700',
    pink: '#ED64A6',
    orange: '#DD6B20',
    purple: '#805AD5',
    maroon: '#800000',
    gold: '#D69E2E',
    silver: '#CBD5E1',
    navy: '#000080',
    teal: '#008080',
    cyan: '#00FFFF',
    brown: '#795548',
    grey: '#808080',
    gray: '#808080',
  };
  if (cssColors[clean.toLowerCase()]) {
    return cssColors[clean.toLowerCase()];
  }

  return '#A0AEC0';
};

/**
 * Returns a human-friendly display label for a color string.
 * e.g. "Jet Black (#000000)" -> "Jet Black"
 */
export const getColorDisplayName = (colorStr: string): string => {
  if (!colorStr) return '';
  const clean = colorStr.trim();
  const hexParenthesisMatch = clean.match(/^(.*?)\s*\((#[0-9a-fA-F]{3,8})\)$/);
  if (hexParenthesisMatch && hexParenthesisMatch[1]) {
    return hexParenthesisMatch[1].trim();
  }
  return clean;
};

