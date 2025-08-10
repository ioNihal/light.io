// Transformation matrices for color blindness simulation
// Based on Brettel, Vienot & Mollon model (1997) and other research.


const matrices = {
    protanopia: [
        0.56667, 0.43333, 0.0,
        0.55833, 0.44167, 0.0,
        0.0, 0.24167, 0.75833
    ],
    protanomaly: [
        0.81667, 0.18333, 0.0,
        0.33333, 0.66667, 0.0,
        0.0, 0.125, 0.875
    ],
    deuteranopia: [
        0.625, 0.375, 0.0,
        0.7, 0.3, 0.0,
        0.0, 0.3, 0.7
    ],
    deuteranomaly: [
        0.8, 0.2, 0.0,
        0.25833, 0.74167, 0.0,
        0.0, 0.14167, 0.85833
    ],
    tritanopia: [
        0.95, 0.05, 0.0,
        0.0, 0.43333, 0.56667,
        0.0, 0.475, 0.525
    ],
    tritanomaly: [
        0.96667, 0.03333, 0.0,
        0.0, 0.73333, 0.26667,
        0.0, 0.18333, 0.81667
    ],
    achromatopsia: [
        0.299, 0.587, 0.114,
        0.299, 0.587, 0.114,
        0.299, 0.587, 0.114
    ],
    achromatomaly: [
        0.618, 0.320, 0.062,
        0.163, 0.775, 0.062,
        0.163, 0.320, 0.516
    ]
};


/**
 * Apply a color-vision-deficiency simulation to image pixels on a canvas.
 *
 * This function reads pixel data from `ctx` for the given `width`/`height`,
 * applies a 3x3 color transformation matrix for the requested `mode`, and
 * writes the modified pixels back to the same canvas context. It mutates the
 * canvas in-place.
 *
 * @param {CanvasRenderingContext2D} ctx - The 2D canvas rendering context to modify.
 * @param {number} width - Pixel width of the area to process (usually `canvas.width` or image width).
 * @param {number} height - Pixel height of the area to process (usually `canvas.height` or image height).
 * @param {string} mode - Simulation mode / matrix key. Supported values:
 *   "protanopia", "protanomaly", "deuteranopia", "deuteranomaly",
 *   "tritanopia", "tritanomaly", "achromatopsia", "achromatomaly".
 *
 * @returns {void}
 *
 * @throws {DOMException} If the canvas is "tainted" (e.g., drawing a cross-origin
 *   image without proper CORS headers) then `getImageData` will throw.
 *
 * @example
 * // draw an image to the canvas first, then:
 * const canvas = document.querySelector('canvas');
 * const ctx = canvas.getContext('2d');
 * // ensure canvas.width/height match the image's resolution before drawing
 * ctx.drawImage(img, 0, 0);
 * applyColorBlindness(ctx, canvas.width, canvas.height, 'deuteranopia');
 *
 * @remarks
 * - This function is CPU-bound and iterates every pixel (4 bytes per pixel).
 *   For large images consider downscaling before processing or using a worker/OffscreenCanvas.
 * - If you want to keep the original intact, draw the image to a separate hidden canvas
 *   and copy or export the processed result instead of mutating the original.
 */
export function applyColorBlindness(ctx, width, height, mode) {
    if (!matrices[mode]) return;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const m = matrices[mode];


    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = r * m[0] + g * m[1] + b * m[2];
        data[i + 1] = r * m[3] + g * m[4] + b * m[5];
        data[i + 2] = r * m[6] + g * m[7] + b * m[8];
    }

    ctx.putImageData(imgData, 0, 0);
}