import { useEffect, useState } from 'react';
import styles from './ContrastRatio.module.css';
import { isValidHex, normalizeHex, wcagResults, getContrast } from './contrastHelpers';
import { useNavigate } from 'react-router-dom';

export default function ContrastRatio() {
    const [textColor, setTextColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");

    const [fontIsLarge, setFontIsLarge] = useState(false);

    const [ratio, setRatio] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        try {
            setError("");
            const r = getContrast(textColor, bgColor);
            setRatio(r);
        } catch (e) {
            setRatio(null);
            setError(e.message || "Invalid Color!");
        }
    }, [textColor, bgColor]);


    function onTextHexChange(e) {
        const v = e.target.value.trim();
        setTextColor(v.startsWith('#') ? v : `#${v}`);
    }

    function onBgHexChange(e) {
        const v = e.target.value.trim();
        setBgColor(v.startsWith('#') ? v : `#${v}`);
    }

    const presets = [
        { label: "Black on White", text: "#000000", bg: "#ffffff" },
        { label: "White on Black", text: "#ffffff", bg: "#000000" },
        { label: "Gray on White", text: "#777777", bg: "#ffffff" },
        { label: "Blue on Yellow", text: "#0d6efd", bg: "#fff3cd" },
    ];

    const displayRatio = ratio ? ratio.toFixed(2) : "--";
    const results = ratio ? wcagResults(ratio) : null;


    // Badge Component
    function Badge({ label, pass }) {
        return (
            <span role='status'
                aria-label={`${label} ${pass ? 'Pass' : 'Fail'}`}
                className={pass ? styles.badgePass : styles.badgeFail}>
                {label}:&nbsp;{pass ? 'Pass' : 'Fail'}
            </span>
        );
    }


    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate('/')}>Back</button>
            <h2 className={styles.title}>Contrast Ratio Checker</h2>
            <div className={styles.card}>

                <div className={styles.controls}>
                    <div className={styles.picker}>
                        <label className={styles.label}>Text&nbsp;Color:</label>
                        <input
                            aria-label="Text color"
                            type="color"
                            value={normalizeHex(textColor)}
                            onChange={(e) => setTextColor(e.target.value)}
                            className={styles.colorInput} />

                        <input
                            className={styles.hexInput}
                            value={normalizeHex(textColor)}
                            onChange={onTextHexChange}
                            onBlur={(e) => {
                                if (isValidHex(e.target.value)) setTextColor(normalizeHex(e.target.value));
                                else setError("Invalid text Hex");
                            }} />
                    </div>

                    <div className={styles.picker}>
                        <label className={styles.label}>Background&nbsp;color:</label>
                        <input
                            aria-label="Background color"
                            type="color"
                            value={normalizeHex(bgColor)}
                            onChange={(e) => setBgColor(e.target.value)}
                            className={styles.colorInput}
                        />
                        <input
                            className={styles.hexInput}
                            value={normalizeHex(bgColor)}
                            onChange={onBgHexChange}
                            onBlur={(e) => {
                                if (isValidHex(e.target.value)) setBgColor(normalizeHex(e.target.value));
                                else setError("Invalid background hex");
                            }}
                        />
                    </div>

                    <div className={styles.option}>
                        <label>
                            <input type='checkbox' checked={fontIsLarge}
                                onChange={(e) => setFontIsLarge(e.target.checked)} />
                            &nbsp;&nbsp;Large text (≥ 18pt / 14pt bold)
                        </label>


                        <div className={styles.presets}>
                            <span className={styles.presetsLabel}>Presets:</span>
                            {presets.map((preset) => (
                                <button key={preset.label}
                                    className={styles.presetBtn}
                                    onClick={() => {
                                        setTextColor(preset.text);
                                        setBgColor(preset.bg);
                                    }}
                                    type='button'>{preset.label}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.previewWrapper}>
                    <div className={styles.preview} style={{
                        color: normalizeHex(textColor),
                        backgroundColor: normalizeHex(bgColor)
                    }}>
                        <div className={styles.previewInner}>
                            <p className={fontIsLarge ? styles.sampleLarge : styles.sample}>
                                The quick brown fox jumps over the lazy dog
                            </p>

                        </div>
                    </div>
                    <div className={styles.results}>
                        <div>
                            <strong>Contrast Ratio:</strong> <span className={styles.ratioVal}>{displayRatio}:1</span>
                        </div>

                        {results && (
                            <div className={styles.badges}>
                                <Badge label="AA (normal ≥ 4.5)" pass={results.aaNormal} />
                                <Badge label="AA (large ≥ 3)" pass={results.aaLarge} />
                                <Badge label="AAA (normal ≥ 7)" pass={results.aaaNormal} />
                                <Badge label="AAA (large ≥ 4.5)" pass={results.aaaLarge} />
                            </div>
                        )}
                    </div>
                </div>

            </div>
            {error && <div className={styles.error}>Error: {error}</div>}

            <div className={styles.note}>
                Tips: white vs black yields the maximum contrast of 21:1.
                Try it: <code>#000000</code>&nbsp;on&nbsp;<code>#ffffff</code>.
            </div>
        </div>
    );
}


