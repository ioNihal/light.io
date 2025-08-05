import { hsl, readableColor, parseToRgb } from 'polished';

// hex-ify an HSL string
function toHex(str) {
    const { red, green, blue } = parseToRgb(str);
    const to2 = v => v.toString(16).padStart(2, '0');
    return `#${to2(red)}${to2(green)}${to2(blue)}`;
}

/**
 * @param {object} opts
 * @param {number} opts.brightness  Lightness (10–90)
 * @param {number} opts.hue         Hue (0–360)
 * @param {number} opts.sat         Sat (0–100)
 * @param {number} opts.count       Number of colors in each palette
 */
export function generatePalette({ brightness, hue, sat, count }) {
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const norm = v => clamp(v, 0, 100) / 100;

    // base lightnesses
    const lightBase = clamp(brightness, 10, 90);
    const darkBase = clamp(100 - brightness, 10, 90);
    const s01 = norm(sat);

    // build a sequence of `count` lightness values:
    //  - for light theme: start at lightBase, step downward to 0
    //  - for dark  theme: start at darkBase, step upward to 1
    function generateSteps(baseL, invert = false) {
        const steps = [];
        const stepCount = count - 1;
        if (!invert) {
            // descending from baseL → 0
            const delta = baseL / stepCount;
            for (let i = 0; i < count; i++) {
                steps.push(clamp((baseL - i * delta) / 100, 0, 1));
            }
        } else {
            // ascending from baseL → 100
            const delta = (100 - baseL) / stepCount;
            for (let i = 0; i < count; i++) {
                steps.push(clamp((baseL + i * delta) / 100, 0, 1));
            }
        }
        return steps;
    }

    function makePalette(baseL, invert) {
        const labels = ['primary', 'accent', 'surface', 'extra1', 'extra2'];
        return generateSteps(baseL, invert).map((l01, idx) => {
            const hslStr = hsl(hue, s01, l01);
            const hex = toHex(hslStr);
            const onColor = readableColor(hex, '#000000', '#FFFFFF', false);
            return {
                label: labels[idx] || `color${idx + 1}`,
                color: hex,
                onColor
            };
        });
    }

    return {
        lightPalette: makePalette(lightBase, true),
        darkPalette: makePalette(darkBase, false),
    };
}
