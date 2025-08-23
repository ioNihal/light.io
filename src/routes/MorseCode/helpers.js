
/**
 * International Morse code map (A–Z, 0–9, basic punctuation).
 * Unmapped characters are ignored.
 */
export const MORSE_MAP = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
    G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
    M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
    S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..",
    0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
    5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
    "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...",
    ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.",
    "-": "-....-", "_": "..--.-", "\"": ".-..-.", "$": "...-..-",
    "@": ".--.-."
};



export function buildTimelineFromText(input) {
    const timeline = []; // items: { on: boolean, units: number }

    const timelinePush = (on, units) => {
        if (units <= 0) return;

        const last = timeline[timeline.length - 1];

        // Coalesce adjacent ON or OFF
        if (last && last.on === on) last.units += units;
        else timeline.push({ on, units });
    }

    const clean = (input || "").normalize("NFKC");

    for (let i = 0; i < clean.length; i++) {
        const ch = clean[i];
        if (ch === " ") {
            // Word gap is 7 units. If previous ended with OFF 1u after a symbol, extend by +6.
            timelinePush(false, 7);
            continue;
        }

        const code = MORSE_MAP[ch.toUpperCase()];
        if (!code) continue; // skip undefined char

        for (let s = 0; s < code.length; s++) {
            const sym = code[s];
            //ON: dot 1u, dash 3u
            timelinePush(true, sym === "." ? 1 : 3);
            // Intra-character gap: OFF 1u (after each symbol)
            // We'll always add it and then adjust after letter to reach the right totals.
            timelinePush(false, 1);
        }

        // After a letter, we already appended OFF 1u; letter gap is OFF 3u total -> add +2
        // (If next is a space, the loop will add its own OFF 7u afterward, which will coalesce.)
        timelinePush(false, 2);
    }

    // Trim trailing OFF (not required but keeps schedule tidy)
    while (timeline.length && timeline[timeline.length - 1].on === false) {
        timeline.pop();
    }

    return timeline;
}

// Convert WPM to a single unit (ms). PARIS standard: 1200 ms / WPM.
export const unitMsFromWPM = (wpm) => 1200 / Math.max(1, wpm);
