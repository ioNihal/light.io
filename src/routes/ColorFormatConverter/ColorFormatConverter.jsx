import { useEffect, useMemo, useState } from 'react';
import styles from './ColorFormatConverter.module.css';
import {
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    hslToRgb,
    hexToHsl,
    hslToHex,
} from './helper';
import { useNavigate } from 'react-router-dom';

export default function ColorFormatConverter() {
    const [hex, setHex] = useState("#FF7A59");
    const [rgb, setRgb] = useState({ r: 255, g: 122, b: 89 });
    const [hsl, setHsl] = useState({ h: 13, s: 100, l: 67 });

    const [rawHex, setRawHex] = useState(hex);
    const [rawRgb, setRawRgb] = useState(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
    const [rawHsl, setRawHsl] = useState(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);

    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(null);


    const navigate = useNavigate();

    useMemo(() => {
        setRawHex(hex);
        setRawRgb(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
        setRawHsl(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);

        setError(null)
    }, [hex, rgb, hsl]);

    const commitHex = (value) => {
        const v = value.trim();
        const maybeRgb = hexToRgb(v);
        if (!maybeRgb) {
            setError("Invalid Hex format! (use #RGB or #RRGGBB)");
            // setRawHex(hex);
            return;
        }

        setError(null);
        setHex(v.toUpperCase());
        setRgb(maybeRgb);
        setHsl(rgbToHsl(maybeRgb.r, maybeRgb.g, maybeRgb.b));
    };

    const commitRgb = (value) => {
        // accept "r,g,b" or "r g b"
        const parts = value.split(/[, ]+/).map(s => s.replace("%", "").trim()).filter(Boolean);
        if (parts.length !== 3) {
            setError("RGB must have three numbers: R G B or R,G,B (0-255).");
            // setRawRgb(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
            return;
        }
        const r = parseInt(parts[0], 10);
        const g = parseInt(parts[1], 10);
        const b = parseInt(parts[2], 10);
        if ([r, g, b].some(v => Number.isNaN(v) || v < 0 || v > 255)) {
            setError("RGB values must be integers between 0 and 255.");
            // setRawRgb(`${rgb.r}, ${rgb.g}, ${rgb.b}`);
            return;
        }
        setError(null);
        setRgb({ r, g, b });
        setHex(rgbToHex(r, g, b));
        setHsl(rgbToHsl(r, g, b));
    };

    const commitHsl = (value) => {
        // accept "h,s%,l%" or "h s l"
        const parts = value.replaceAll("%", "").split(/[, ]+/).map(s => s.trim()).filter(Boolean);
        if (parts.length !== 3) {
            setError("HSL requires three values: H S L (H 0-360, S 0-100, L 0-100).");
            // setRawHsl(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
            return;
        }
        const h = parseFloat(parts[0]);
        const s = parseFloat(parts[1]);
        const l = parseFloat(parts[2]);
        if (
            Number.isNaN(h) || h < 0 || h > 360 ||
            Number.isNaN(s) || s < 0 || s > 100 ||
            Number.isNaN(l) || l < 0 || l > 100
        ) {
            setError("H must be 0-360, S/L must be 0-100.");
            // setRawHsl(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
            return;
        }
        setError(null);
        setHsl({ h: Math.round(h), s: Math.round(s), l: Math.round(l) });
        const rgbObj = hslToRgb(h, s, l);
        setRgb(rgbObj);
        setHex(rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b));
    };

    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(text);
        } catch (e) {
            console.error(`Something went wrong! ${e.message || e}`);
        }
    }

    useEffect(() => {
        const id = setTimeout(() => {
            setCopied(null);
        }, 3000)

        return () => clearTimeout(id);
    }, [copied])

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate('/')}>Back</button>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Hex • RGB • HSL Converter</h2>
                    <p className={styles.subtitle}>Converts color formats between RGB, Hex, HSL</p>
                </header>
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label className={styles.label}>HEX</label>
                        <input
                            className={styles.input}
                            value={rawHex}
                            onChange={(e) => setRawHex(e.target.value)}
                            onBlur={(e) => commitHex(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && commitHex(e.target.value)}
                        />
                        <div className={styles.rowSmall}>
                            <button className={styles.btn} onClick={() => commitHex(rawHex)}>Apply</button>
                            <button className={styles.btn} onClick={() => { setRawHex(hex); copy(hex); }}>{copied === hex ? 'Copied' : 'Copy'}</button>
                        </div>
                    </div>

                    <div className={styles.preview} style={{ backgroundColor: hex }}>
                        <div className={styles.previewInner}>{hex}</div>
                    </div>
                </div>

                <div className={`${styles.row} ${styles.rowSecond}`}>
                    <div className={styles.field}>
                        <label className={styles.label}>RGB</label>
                        <input
                            className={styles.input}
                            value={rawRgb}
                            onChange={(e) => setRawRgb(e.target.value)}
                            onBlur={(e) => commitRgb(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && commitRgb(e.target.value)}
                        />
                        <div className={styles.rowSmall}>
                            <button className={styles.btn} onClick={() => commitRgb(rawRgb)}>Apply</button>
                            <button className={styles.btn} onClick={() => { setRawRgb(`${rgb.r}, ${rgb.g}, ${rgb.b}`); copy(`${rgb.r}, ${rgb.g}, ${rgb.b}`); }}>{copied === `${rgb.r}, ${rgb.g}, ${rgb.b}` ? 'Copied' : 'Copy'}</button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>HSL</label>
                        <input
                            className={styles.input}
                            value={rawHsl}
                            onChange={(e) => setRawHsl(e.target.value)}
                            onBlur={(e) => commitHsl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && commitHsl(e.target.value)}
                        />
                        <div className={styles.rowSmall}>
                            <button className={styles.btn} onClick={() => commitHsl(rawHsl)}>Apply</button>
                            <button className={styles.btn} onClick={() => { setRawHsl(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`); copy(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`); }}>{copied === `${hsl.h}, ${hsl.s}%, ${hsl.l}%` ? 'Copied' : 'Copy'}</button>
                        </div>
                    </div>
                </div>


                <div className={styles.footerNote}>
                    Type values and press <strong>Enter</strong> or click <em>Apply</em>. Inputs accept:
                    <ul>
                        <li>HEX: <code>#RRGGBB</code> or <code>#RGB</code></li>
                        <li>RGB: <code>R, G, B</code> (0–255)</li>
                        <li>HSL: <code>H, S, L</code> (H 0–360, S/L 0–100)</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
