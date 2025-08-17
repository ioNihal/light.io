import { useMemo, useRef, useState } from 'react';
import styles from './WhitePaletteGenerator.module.css';
import { clamp, generateTintedWhites, randomPastelTint } from './helpers.js';
import { useNavigate } from 'react-router-dom';

export default function WhitePaletteGenerator() {
    const [tint, setTint] = useState("#FFF6E8");
    const [rawTint, setRawTint] = useState("#FFF6E8");

    const [count, setCount] = useState(5);
    const [rawCount, setRawCount] = useState("5");

    const [tintError, setTintError] = useState(null);
    const [countError, setCountError] = useState(null);

    const [copied, setCopied] = useState(null);
    const navigate = useNavigate();

    const debounceRef = useRef(null);

    const handleColorPicker = (e) => {
        const value = e.target.value;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            setTint(value)
            setRawTint(value)
        }, 300);
    };


    const shades = useMemo(() => generateTintedWhites(tint, count, 0.84), [tint, count]);

    const copy = async (hex) => {
        try {
            await navigator.clipboard.writeText(hex);
            setCopied(hex);
            setTimeout(() => setCopied(null), 1000);
        } catch (e) {
            alert(`Something went wrong! ${e.message || e}`);
        }
    };

    const handleRandomTint = () => {
        const rand = randomPastelTint();
        setTint(rand);
    }


    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate('/')}>BACK</button>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h2 className={styles.title}>White Palette Generator</h2>
                    <p className={styles.subTitle}>
                        Create  subtle off-whites (tinted) up to pure white. Great for surfaces, cards, borders, and gentle contrasts.
                    </p>
                    <p className={styles.info}>
                        Duplicate shades close to pure white are automatically removed.
                    </p>
                </header>

                <section className={styles.controls}>
                    <div className={styles.controlGroup}>
                        <label className={styles.label}>Tint</label>
                        <div className={styles.tintRow}>
                            <input
                                type="color"
                                value={tint}
                                onChange={handleColorPicker}
                                className={styles.colorInput}
                                aria-label='Tint Color Picker'
                            />
                            <input
                                type="text"
                                value={rawTint}
                                onChange={(e) => setRawTint(e.target.value)}

                                onBlur={() => {
                                    const v = rawTint.trim();
                                    if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(v)) {
                                        setTint(v.toUpperCase());
                                        setRawTint(v.toUpperCase());
                                        setTintError(null);
                                    } else {
                                        setRawTint(tint);
                                        setTintError("*Please enter a valid hex color (e.g., #FFF or #FFFFFF).");
                                    }
                                }}
                                className={styles.textInput}
                                placeholder="#FFF6E8"
                                aria-label='Tint Color Input'
                            />
                            <button
                                onClick={handleRandomTint}
                                className={styles.button}
                                title="Pick a random soft tint"
                            >
                                Random Tint
                            </button>
                        </div>
                        {tintError && <p className={styles.error}>{tintError}</p>}
                    </div>

                    <div className={styles.controlGroup}>
                        <label className={styles.label}>Number of Shades</label>
                        <input type="number"
                            min={0} max={50}
                            value={rawCount}
                            onChange={(e) => setRawCount(e.target.value)}
                            onBlur={() => {
                                const num = parseInt(rawCount || "0", 10);
                                if (!isNaN(num) && num >= 2 && num <= 50) {
                                    setCount(num);
                                    setRawCount(String(num));
                                    setCountError(null);
                                } else {
                                    setRawCount(String(count));
                                    setCountError("*Shades must be a number between 2 and 50.");
                                }
                            }}
                            className={styles.numberInput} />
                        {countError && <p className={styles.error}>{countError}</p>}
                    </div>
                </section>

                <section className={styles.paletteGrid}>
                    {shades.map((hex, i) => (
                        <button key={hex + i}
                            onClick={() => copy(hex)}
                            className={styles.colorTile}
                            style={{ backgroundColor: hex }}
                            title={`Copy ${hex}`}>
                            <div className={styles.tileBlock} />
                            <div className={styles.hexLabel}>{hex}</div>

                            {copied === hex && (
                                <span className={styles.copied}>Copied</span>
                            )}

                            <span className={styles.hoverHint}>
                                Click to copy
                            </span>
                        </button>
                    ))}
                </section>
            </div>
        </div>
    );
}
