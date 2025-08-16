export function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

export function hexToRGB(hex) {
    const h = hex.replace("#", "");
    const n = h.length === 3 ?
        h.split("").map((c) => c + c).join("") : h;

    const int = parseInt(n, 16);
    return {
        r: (int >> 16) & 255,
        g: (int >> 8) & 255,
        b: int & 255,
    };
}


export function rgbToHex(r, g, b) {
    const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function mixRGB(a, b, t) {
    return {
        r: a.r + (b.r - a.r) * t,
        g: a.g + (b.g - a.g) * t,
        b: a.b + (b.b - a.b) * t,
    };
}

export function hslToRGB(h, s, l) {
    // h: 0-360, s/l: 0-100
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return { r: 255 * f(0), g: 255 * f(8), b: 255 * f(4) };
}

export function hslToHex(h, s, l) {
    const { r, g, b } = hslToRGB(h, s, l);
    return rgbToHex(r, g, b);
}

export function randomPastelTint() {
    const h = Math.floor(Math.random() * 360);   // any hue
    const s = 5 + Math.random() * 15;            // 5–20% saturation (very gentle)
    const l = 92 + Math.random() * 6;            // 92–98% lightness (near white)
    return hslToHex(h, s, l);
}

/** Generate whites by blending the tint toward white.
 *  startWhiteness = how close to white the darkest swatch should be (0..1).
 *  0.84 means even the darkest is 84% white + 16% tint.
 * @param {string} tintHex - hex format color for tint
 * @param {Number} count - number of variants to generate
 * @param {Number} startWhiteness - value from 0 - 1
 * @returns {string[]} Array of Hex formated Colors Strings
 */
export function generateTintedWhites(tintHex, count, startWhiteness = 0.84) {
    const tint = hexToRGB(tintHex);
    const white = { r: 255, g: 255, b: 255 };
    const n = clamp(parseInt(count || 0, 10), 2, 50);

    const list = [];
    for (let i = 0; i < n; i++) {
        const t = n === 1 ? 1
            : startWhiteness + (1 - startWhiteness) * (i / (n - 1)); // → 1.0 at the end
        const mixed = mixRGB(tint, white, t);
        list.push(rgbToHex(mixed.r, mixed.g, mixed.b));
    }
    // Remove accidental duplicates if count is very high
    return [...new Set(list)];
}

