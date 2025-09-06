

/**
 * Return true if color is strongly reddish.
 * A conservative, fast heuristic (not color-science perfect).
 * @param {string} hex - color in "#rrggbb" form
 * @returns {boolean}
 */
export function isRedish(hex) {
  if (!hex || typeof hex !== "string") return false;
  if (hex[0] === "#") {
    if (hex.length === 7) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      // require red significantly larger than others and reasonably bright
      return r > Math.max(g, b) * 1.25 && r > 120;
    }
    // accept shorthand #rgb
    if (hex.length === 4) {
      const r = parseInt(hex[1] + hex[1], 16);
      const g = parseInt(hex[2] + hex[2], 16);
      const b = parseInt(hex[3] + hex[3], 16);
      return r > Math.max(g, b) * 1.25 && r > 120;
    }
  }
  return false;
}

/**
 * Heuristic seizure risk analysis.
 * Inputs are expected to be numbers (frequency in Hz, duty and area in percent, duration in seconds)
 * and color is hex string like "#ff0000".
 * Returns an object:
 * { score: 0..100, level: "Low"|"Medium"|"High", reasons: [], mitigation: [], breakdown: {...} }
 */
export function analyzeSeizureRisk({ frequency = 12, duty = 50, area = 30, duration = 3, color = "#ff0000" } = {}) {
  // --- frequency risk (peak around 10-20Hz; considered risky between ~3-60Hz) ---
  let freqRisk = 0;
  if (typeof frequency === "number" && frequency >= 3 && frequency <= 60) {
    const peak = 16; // heuristic peak sensitivity
    const dist = Math.abs(frequency - peak);
    // map dist 0 -> 1 and dist >= 40 -> 0, linear falloff
    freqRisk = Math.max(0, 1 - dist / 40);
  }

  // duty cycle risk: more "on" time increases brightness/contrast risk
  const dutyRisk = Math.min(1, Math.max(0, duty / 100)); // clamp 0..1

  // area risk: larger fraction of retina stimulated -> higher risk (scale a bit)
  const areaRisk = Math.min(1, Math.max(0, (area / 100) * 1.5));

  // color risk: saturated red / high contrast is riskier
  const colorRisk = isRedish(color) ? 1.0 : 0.25;

  // duration risk: exposures <1s are much less risky; >3s add risk
  const durationRisk = typeof duration === "number"
    ? duration <= 1 ? 0 : Math.min(1, (duration - 1) / 9)
    : 0;

  // Weights (tuned conservatively)
  const weights = {
    freq: 0.40,
    duty: 0.15,
    area: 0.15,
    color: 0.15,
    duration: 0.15,
  };

  const scoreRaw =
    freqRisk * weights.freq * 100 +
    dutyRisk * weights.duty * 100 +
    areaRisk * weights.area * 100 +
    colorRisk * weights.color * 100 +
    durationRisk * weights.duration * 100;

  const score = Math.round(Math.min(100, Math.max(0, scoreRaw)));

  let level = "Low";
  if (score >= 61) level = "High";
  else if (score >= 31) level = "Medium";

  // build reasons
  const reasons = [];
  if (freqRisk > 0.35) reasons.push(`Frequency ${frequency} Hz is within a risky band.`);
  if (dutyRisk > 0.6) reasons.push(`High duty cycle (${duty}%) — long bright phase.`);
  if (areaRisk > 0.5) reasons.push(`Large visual area affected (${area}%).`);
  if (colorRisk > 0.9) reasons.push(`Saturated red color selected (known higher sensitivity).`);
  if (durationRisk > 0.4) reasons.push(`Long exposure (${duration}s) increases cumulative risk.`);
  if (reasons.length === 0) reasons.push("No strong individual factors, but combine cautiously.");

  // mitigation suggestions
  const mitigation = [];
  if (frequency > 3) mitigation.push("Limit flash rate to ≤ 3 Hz if possible (WCAG/broadcast guidance).");
  mitigation.push("Reduce brightness/contrast, reduce area, shorten duration.");
  mitigation.push("Avoid saturated red flashes; prefer smooth fades or slow transitions.");
  mitigation.push("Provide clear warnings & allow viewers to skip or turn off effect.");

  const breakdown = { freqRisk, dutyRisk, areaRisk, colorRisk, durationRisk };

  return { score, level, reasons, mitigation, breakdown };
}

/**
 * Convert a frequency in Hz to a period (seconds) for a single flash cycle.
 * If frequency is <= 0 or not a number, returns null (meaning 'no flashing').
 * Example: 2 Hz => 0.5s (period)
 * Note: if you want a duty-controlled on/off cycle you can compute on/off time separately:
 *  period = 1 / frequency;
 *  onTime = period * (duty / 100)
 * @param {number} frequencyHz
 * @returns {number|null}
 */
export function computeFlashPeriodHz(frequencyHz) {
  const f = Number(frequencyHz);
  if (!f || !(f > 0)) return null;
  return 1 / f;
}
