import { useState, useMemo, useEffect, useRef } from 'react';
import styles from './AutoLightThemeGenerator.module.css';
import { generatePalette } from './generateTheme';
import ThemePreview from './ThemePreview';

import Header from '../../components/Header/Header';

export default function AutoLightThemeGenerator() {
    const [brightness, setBrightness] = useState(70);
    const [hue, setHue] = useState(220);
    const [sat, setSat] = useState(80);
    const [count, setCount] = useState(3);
    const [copiedToken, setCopiedToken] = useState(null);

    const [savedColors, setSavedColors] = useState(() => {
        const saved = localStorage.getItem("savedColors");
        return saved ? JSON.parse(saved) : [];
    });
    const [toolTip, setToolTip] = useState("Save upto 5");
    const [disableSave, setDisableSave] = useState(false);

    const previewBoxRef = useRef(null);
    const savedConRef = useRef(null);

    const { lightPalette, darkPalette } = useMemo(
        () => generatePalette({ brightness, hue, sat, count }),
        [brightness, hue, sat, count]
    );


    useEffect(() => {
        const saved = localStorage.getItem("savedColors");
        if (saved) setSavedColors(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("savedColors", JSON.stringify(savedColors));

        if (savedColors.length >= 5) {
            setTimeout(() => {
                setDisableSave(true);
                setToolTip("Saved is full 5/5!");
            }, 2000)
        } else {
            setDisableSave(false);
            setToolTip(`Save upto ${savedColors.length}/5`);
        }
    }, [savedColors]);


    useEffect(() => {
        if (copiedToken) {
            const timeout = setTimeout(() => {
                setCopiedToken(null);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [copiedToken]);

    const handleSave = () => {
        if (savedColors.length >= 5) {
            handleScroll(savedConRef);
            return;
        }
        handleScroll(savedConRef);
        const newColor = { hue, sat, brightness };
        setSavedColors([...savedColors, newColor]);
    };

    const handleApply = (color) => {
        setHue(color.hue);
        setSat(color.sat);
        setBrightness(color.brightness);
    };

    const handleDelete = (index) => {
        setSavedColors(savedColors.filter((_, i) => i !== index));
    };




    const handleScroll = (target) => {
        if (target.current) {
            target.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });
        }
    };


    const copyToken = (tokenName, color, name = 'default') => {
        navigator.clipboard.writeText(`--${tokenName}: ${color};`);
        setCopiedToken(name);
    }

    return (
        <div className={styles.container}>
            <Header toolName={"Light Theme Generator"} />

            <div className={styles.controls}>
                <div className={styles.row}>
                    <label>
                        <span>Palette size:</span>
                        {[3, 4, 5].map(n => (
                            <span className={`${styles.countSpan} ${n === count ? styles.activeCount : ""}`} key={n} onClick={() => setCount(n)}>
                                {n}
                            </span>
                        ))}
                    </label>
                    <button className={styles.saveBtn} onClick={() => {
                        handleSave();
                    }} disabled={disableSave}>Save<span className={styles.toolTip}>{toolTip}</span></button>
                </div>

                <div className={styles.row}>
                    <label>
                        <span>Hue:</span>
                        <input
                            className={styles.inputBox}
                            type="number" min={0} max={360}
                            value={hue}
                            onChange={e => setHue(+e.target.value)}
                        />
                        deg
                    </label>
                    <div
                        className={styles.colorPreview}
                        style={{ backgroundColor: `hsl(${hue}, ${sat}%, ${brightness}%)` }}
                    />
                </div>


                <div className={styles.row}>
                    <label>
                        <span>Brightness:</span>
                        <input
                            className={styles.inputBox}
                            type="number" min={10} max={90}
                            value={brightness}
                            onChange={e => setBrightness(+e.target.value)}
                        />
                        %
                    </label>
                    <label>
                        <span>Saturation:</span>
                        <input
                            className={styles.inputBox}
                            type="number" min={0} max={100}
                            value={sat}
                            onChange={e => setSat(+e.target.value)}
                        />
                        %
                    </label>
                </div>
            </div>

            <div className={styles.scrollBtn} onClick={() => handleScroll(previewBoxRef)}>
                <span>Scroll to Preview</span>
            </div>

            <div className={styles.previewBox} ref={previewBoxRef}>
                <ThemePreview
                    label="Light Theme"
                    palette={lightPalette}
                    onCopyToken={copyToken}
                    copiedToken={copiedToken}
                    type='light'
                />
                <ThemePreview
                    label="Dark Theme"
                    palette={darkPalette}
                    onCopyToken={copyToken}
                    copiedToken={copiedToken}
                    type='dark'
                />
            </div>

            <div className={styles.savedContainer} ref={savedConRef}>
                {savedColors.map((color, index) => {
                    const bg = `hsl(${color.hue}, ${color.sat}%, ${color.brightness}%)`;
                    return (
                        <div
                            key={index}
                            className={styles.swatch}
                            style={{ backgroundColor: bg }}
                        >
                            <div className={styles.swatchActions}>
                                <button onClick={() => handleApply(color)}>Apply</button>
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className={styles.description}>
                The Light Theme Generator lets you create custom themes from a single base color.
                Adjust the hue, brightness, and saturation to instantly generate a palette of 3, 4, or 5
                colors. You can preview both light and dark theme variations, and see how your chosen
                colors apply across UI elements like buttons, headings, and sections. Once you're happy
                with the result, simply save your palette for reuse in your projects.
            </p>
        </div>
    );
}
