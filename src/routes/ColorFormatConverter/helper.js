
export function clamp(v, a, b) {
    return Math.min(b, Math.max(a, v));
}

/* HEX <-> RGB */
export function hexToRgb(hex) {
    if (typeof hex !== "string") return null;
    const s = hex.replace("#", "").trim();
    if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(s)) return null;
    const full = s.length === 3 ? s.split("").map(c => c + c).join("") : s;
    const int = parseInt(full, 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    return { r, g, b };
}

export function rgbToHex(r, g, b) {
    const toHex = n => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/* RGB <-> HSL
   H: 0..360, S: 0..100, L: 0..100
*/
export function rgbToHsl(r, g, b) {
    // normalize to 0..1
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    // Lightness
    let h = 0;
    const l = (max + min) / 2;

    // Saturation
    let s = 0;
    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));
        // Hue
        if (max === rn) {
            h = ((gn - bn) / delta) % 6;
        } else if (max === gn) {
            h = (bn - rn) / delta + 2;
        } else {
            h = (rn - gn) / delta + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    } else {
        h = 0;
        s = 0;
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

export function hslToRgb(h, s, l) {
    const H = (Number(h) % 360 + 360) % 360;
    const S = clamp(Number(s) / 100, 0, 1);
    const L = clamp(Number(l) / 100, 0, 1);

    if (S === 0) {
        const gray = Math.round(L * 255);
        return { r: gray, g: gray, b: gray };
    }

    const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    const p = 2 * L - q;
    const hk = H / 360;

    const r = hue2rgb(p, q, hk + 1 / 3);
    const g = hue2rgb(p, q, hk);
    const b = hue2rgb(p, q, hk - 1 / 3);

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/* Convenience */
export function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h, s, l) {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}
