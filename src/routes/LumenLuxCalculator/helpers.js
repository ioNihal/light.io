
/**
 * Calculate lux from lumens and area.
 * @param {number} lumens - The luminous flux in lumens.
 * @param {number} area - The area in square meters.
 * @returns {number} Lux value.
 */
export function calcLux(lumens, area) {
    if (area <= 0) return 0;
    return lumens / area;
}


/**
 * Calculate lumens from lux and area.
 * @param {number} lux - The illuminance in lux.
 * @param {number} area - The area in square meters.
 * @returns {number} Lumens value.
 */
export function calcLumens(lux, area) {
    return lux * area;
}

/**
 * Calculate area from lumens and lux.
 * @param {number} lumens - The luminous flux in lumens.
 * @param {number} lux - The illuminance in lux.
 * @returns {number} Area in square meters.
 */
export function calcArea(lumens, lux) {
    if (lux <= 0) return 0;
    return lumens / lux;
}