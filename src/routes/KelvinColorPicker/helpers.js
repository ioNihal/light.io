
/**
 * Clamp a number between min and max.
 * @param {number} n - value to clamp
 * @param {number} [min=0] - minimum
 * @param {number} [max=255] - maximum
 * @returns {number}
 */
export function clamp(n, min = 0, max = 255) {
  return Math.min(max, Math.max(min, Math.round(Number(n) || 0)));
}

/**
 * Convert a Kelvin temperature to an {r,g,b} object (0-255).
 * Approximate algorithm suitable for UI previews.
 *
 * Valid/usable input range: ~1000 .. 40000 (function clamps internally).
 *
 * @param {number|string} kelvinInput - temperature in Kelvin
 * @returns {{r:number,g:number,b:number}} RGB object
 */
export function kelvinToRgb(kelvinInput) {
  let K = Math.round(Number(kelvinInput) || 0);
  if (K < 1000) K = 1000;
  if (K > 40000) K = 40000;

  const temp = K / 100;

  let red;
  let green;
  let blue;

  // Red
  if (temp <= 66) {
    red = 255;
  } else {
    red = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    red = clamp(red);
  }

  // Green
  if (temp <= 66) {
    green = 99.4708025861 * Math.log(temp) - 161.1195681661;
    green = clamp(green);
  } else {
    green = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    green = clamp(green);
  }

  // Blue
  if (temp >= 66) {
    blue = 255;
  } else if (temp <= 19) {
    blue = 0;
  } else {
    blue = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
    blue = clamp(blue);
  }

  // final clamp & integer
  return {
    r: clamp(red),
    g: clamp(green),
    b: clamp(blue),
  };
}

/**
 * Convert r,g,b to hex string "#RRGGBB"
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} uppercase hex with leading '#'
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) =>
    clamp(n)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert Kelvin temperature to HEX string "#RRGGBB"
 * @param {number|string} kelvin
 * @returns {string}
 */
export function kelvinToHex(kelvin) {
  const { r, g, b } = kelvinToRgb(kelvin);
  return rgbToHex(r, g, b);
}
