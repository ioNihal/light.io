import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './KelvinColorPicker.module.css';
import { useNavigate } from 'react-router-dom';
import { kelvinToHex, kelvinToRgb } from './helpers.js';
import RangeSlider from '../../components/RangeSlider/RangeSlider.jsx';

const MIN_K = 1000;
const MAX_K = 10000;
const STEP = 100;
const INITIAL = 2700;

export default function KelvinColorPicker() {
    const [kelvin, setKelvin] = useState(INITIAL);
    const [rawKelvin, setRawKelvin] = useState(String(INITIAL));
    const [copied, setCopied] = useState(null);
    const [error, setError] = useState(null);
    const copyTimeoutRef = useRef(null);
    const navigate = useNavigate();


    const hex = useMemo(() => kelvinToHex(kelvin), [kelvin]);
    const rgb = useMemo(() => kelvinToRgb(kelvin), [kelvin]);

    // preview steps
    const previewSteps = useMemo(() => {
        const points = 6;
        const span = 1200;
        const start = Math.max(MIN_K, kelvin - span / 2);
        const end = Math.min(MAX_K, kelvin + span / 2);
        const out = [];
        for (let i = 0; i < points; i++) {
            const t = Math.round(start + (i / (points - 1)) * (end - start));
            out.push({ k: t, hex: kelvinToHex(t) });
        }
        return out;
    }, [kelvin]);

    useEffect(() => {
        if (copied == null) return;
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => setCopied(null), 2000);
        return () => clearTimeout(copyTimeoutRef.current);
    }, [copied]);


    useEffect(() => {
        setRawKelvin(String(kelvin));
    }, [kelvin]);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(text);
        } catch {
            console.error('Failed to copy!');
        }
    };

    const commitRawKelvin = (valueStr) => {
        const trimmed = String(valueStr || "").trim();

        // If user left the field empty — revert to the current Kelvin (no error)
        if (trimmed === "") {
            setRawKelvin(String(kelvin));
            setError(null);
            return;
        }

        // Try to parse a number
        const v = Number(trimmed);
        if (Number.isNaN(v)) {
            setError("Please enter a numeric Kelvin value.");
            return;
        }

        // Check range
        if (v < MIN_K || v > MAX_K) {
            setError(`Kelvin must be between ${MIN_K} and ${MAX_K}.`);
            return;
        }

        // Round to nearest STEP and clamp strictly (defensive)
        const rounded = Math.round(v / STEP) * STEP;
        const clamped = Math.max(MIN_K, Math.min(MAX_K, rounded));

        // Commit
        setKelvin(clamped);
        setRawKelvin(String(clamped));
        setError(null);
    };


    const presets = [
        { label: "Candlelight", k: 1900 },
        { label: "Warm (Incandescent)", k: 2700 },
        { label: "Soft White", k: 3000 },
        { label: "Daylight", k: 5500 },
        { label: "Noon Sun", k: 6500 },
    ];

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate("/")}>
                Back
            </button>

            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Kelvin Color Temperature Picker</h2>
                    <p className={styles.subtitle}>
                        Slide through candlelight to daylight color temperatures.
                    </p>
                </header>
                {error && <p className={styles.error}>{error}</p>}
                <section className={styles.controls}>
                    <div className={styles.sliderRow}>
                        <label className={styles.label}>
                            Temperature: <span className={styles.kLabel}>{kelvin} K</span>
                        </label>

                        <RangeSlider
                            className={styles.slider}
                            type="range"
                            min={MIN_K}
                            max={MAX_K}
                            step={STEP}
                            value={kelvin}
                            trackHeight={30}
                            thumbSize={30}
                            onChange={(e) => {
                                const v = Number(e.target.value);
                                if (!Number.isNaN(v)) {
                                    setKelvin(Math.round(v));
                                }
                            }}
                            aria-label="Kelvin temperature slider"
                        />

                        <div className={styles.rawInputRow}>
                            <input
                                className={styles.numberInput}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={rawKelvin}
                                onChange={(e) => setRawKelvin(e.target.value)}
                                onBlur={(e) => commitRawKelvin(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        commitRawKelvin(e.currentTarget.value);
                                        e.currentTarget.blur();
                                    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                        e.preventDefault();
                                        const delta = e.key === "ArrowUp" ? STEP : -STEP;
                                        const current = Number(rawKelvin) || kelvin;
                                        const next = Math.round((current + delta) / STEP) * STEP;
                                        setRawKelvin(String(Math.max(MIN_K, Math.min(MAX_K, next))));
                                    }
                                }}
                                onWheel={(e) => {
                                    if (document.activeElement === e.currentTarget) {
                                        e.currentTarget.blur();
                                    }
                                }}
                                aria-label="Kelvin numeric input"
                            />
                        </div>
                    </div>

                    <div className={styles.presets}>
                        {presets.map((p) => (
                            <button
                                className={styles.presetBtn}
                                key={p.k}
                                onClick={() => setKelvin(p.k)}
                                aria-label={`Set ${p.label} ${p.k} Kelvin`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.previewArea}>
                    <div
                        className={styles.previewSwatch}
                        style={{ backgroundColor: hex }}
                        aria-hidden="true"
                    />

                    <div className={styles.info}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>HEX</span>
                            <code className={styles.code}>{hex}</code>
                            <button
                                className={styles.smallBtn}
                                onClick={() => handleCopy(hex)}
                                aria-label={`Copy hex ${hex}`}
                            >
                                {copied === hex ? "Copied" : "Copy"}
                            </button>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>RGB</span>
                            <code className={styles.code}>{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</code>
                            <button
                                className={styles.smallBtn}
                                onClick={() => handleCopy(`${rgb.r}, ${rgb.g}, ${rgb.b}`)}
                                aria-label={`Copy rgb ${rgb.r}, ${rgb.g}, ${rgb.b}`}
                            >
                                {copied === `${rgb.r}, ${rgb.g}, ${rgb.b}` ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                </section>

                <section className={styles.gradientPreview}>
                    {previewSteps.map((p) => (
                        <div
                            className={styles.previewStep}
                            key={p.k}
                            style={{ backgroundColor: p.hex }}
                            title={`${p.k} K`}
                        >
                            <div className={styles.stepLabel}>{p.k}K</div>
                        </div>
                    ))}
                </section>

                <footer className={styles.note}>
                    Tip: lower Kelvin → warmer (orange), higher Kelvin → cooler / bluish.
                </footer>
            </div>
        </div>
    );
}
