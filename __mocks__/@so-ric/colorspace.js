// Jest mock for @so-ric/colorspace to handle ESM import issues
module.exports = {
  rgb: () => ({ r: 0, g: 0, b: 0 }),
  hsv: () => ({ h: 0, s: 0, v: 0 }),
  hsl: () => ({ h: 0, s: 0, l: 0 }),
  lab: () => ({ l: 0, a: 0, b: 0 }),
  hex: () => '#000000',
  toString: () => '#000000',
  // Export default for ESM compatibility
  __esModule: true,
  default: {
    rgb: () => ({ r: 0, g: 0, b: 0 }),
    hsv: () => ({ h: 0, s: 0, v: 0 }),
    hsl: () => ({ h: 0, s: 0, l: 0 }),
    lab: () => ({ l: 0, a: 0, b: 0 }),
    hex: () => '#000000',
    toString: () => '#000000'
  }
};