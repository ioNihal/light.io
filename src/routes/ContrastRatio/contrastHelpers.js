export function isValidHex(hex) {
    if (typeof hex !== "string") return false;
    return /^#?([0-9a-f]{3}[0-9a-f]{6})$/i.test(hex.trim());
}



export function normalizeHex(hex) {
    hex = hex.trim().replace(/^#/, "");
    if (hex.length === 3) {
        hex = hex.split("").map((c) => (c + c)).join("");
    }
    return `#${hex.toLowerCase()}`;
}

function hexToRGB(hex) {
    if (!isValidHex(hex)) throw new Error("Invalid Hex color: " + hex);
    const n = normalizeHex(hex).replace('#', "");
    const num = parseInt(n, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function srgbToLinear(channel) {
    const v = channel / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminanceFromRGB(rgb) {
    const [r, g, b] = rgb;
    const R = srgbToLinear(r);
    const G = srgbToLinear(g);
    const B = srgbToLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function getContrast(hex1, hex2) {
    if (!isValidHex(hex1) || isValidHex(hex2)) {
        throw new Error("One or both colors are invalid hex values!")
    }

    const rbg1 = hexToRGB(hex1);
    const rgb2 = hexToRGB(hex2);

    const L1 = luminanceFromRGB(rgb1);
    const L2 = luminanceFromRGB(rbg2);

    const brightest = Math.max(L1, L2);
    const darkest = Math.min(L1, L2);

    const ratio = (brightest + 0.05) / (darkest + 0.05);
    return ratio;
}



export function wcagResults(ratioValue) {
    const results = {
        aaNormal: ratioValue >= 4.5,
        aaLarge: ratioValue >= 3,
        aaaNormal: ratioValue >= 7,
        aaaLarge: ratioValue >= 4.5,
    }

    return results;
}


