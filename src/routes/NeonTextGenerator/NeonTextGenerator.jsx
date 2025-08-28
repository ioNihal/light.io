import { useState, useRef } from "react";
import styles from "./NeonTextGenerator.module.css";
import RangeSlider from "../../components/RangeSlider/RangeSlider";
import { useNavigate } from "react-router-dom";

export default function NeonTextGenerator({ onBack }) {
    const [text, setText] = useState("Your Neon Text");
    const [color, setColor] = useState("#ff00ff");
    const [fontFamily, setFontFamily] = useState("'Arial', sans-serif");
    const [glowIntensity, setGlowIntensity] = useState(5);
    const [fontSize, setFontSize] = useState(48);
    const [animation, setAnimation] = useState("none");
    const [cssCode, setCssCode] = useState("");
    const textRef = useRef(null);

    const navigate = useNavigate();

    const generateCSS = () => {
        const css = `
.neon-text {
    color: ${color};
    font-family: ${fontFamily};
    font-size: ${fontSize}px;
    font-weight: bold;
    text-shadow: 
        0 0 ${glowIntensity}px currentColor,
        0 0 ${glowIntensity * 2}px currentColor,
        0 0 ${glowIntensity * 4}px currentColor,
        0 0 ${glowIntensity * 8}px currentColor${animation !== "none" ? `,
        0 0 ${glowIntensity * 12}px ${color},
        0 0 ${glowIntensity * 16}px ${color}` : ''};
    ${animation !== "none" ? `animation: ${animation} 1.5s ease-in-out infinite alternate;` : ''}
}

${animation === "pulse" ? `
@keyframes pulse {
    from {
        text-shadow: 
            0 0 ${glowIntensity}px currentColor,
            0 0 ${glowIntensity * 2}px currentColor,
            0 0 ${glowIntensity * 4}px currentColor,
            0 0 ${glowIntensity * 8}px currentColor;
    }
    to {
        text-shadow: 
            0 0 ${glowIntensity * 1.5}px currentColor,
            0 0 ${glowIntensity * 3}px currentColor,
            0 0 ${glowIntensity * 6}px currentColor,
            0 0 ${glowIntensity * 12}px currentColor,
            0 0 ${glowIntensity * 18}px currentColor,
            0 0 ${glowIntensity * 24}px currentColor;
    }
}` : ''}

${animation === "flicker" ? `
@keyframes flicker {
    0%, 18%, 22%, 25%, 53%, 57%, 100% {
        text-shadow: 
            0 0 ${glowIntensity}px currentColor,
            0 0 ${glowIntensity * 2}px currentColor,
            0 0 ${glowIntensity * 4}px currentColor,
            0 0 ${glowIntensity * 8}px currentColor;
    }
    20%, 24%, 55% {
        text-shadow: none;
    }
}` : ''}
        `;
        setCssCode(css);
        return css;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);

        const button = document.getElementById('copyButton');
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy CSS';
        }, 2000);
    };

    const presetColors = [
        "#ff00ff", "#00ffff", "#ff0000", "#00ff00", "#0000ff",
        "#ffff00", "#ff7700", "#ff33cc", "#33ccff", "#ff3366"
    ];

    return (
        <div className={styles.container}>

            <button className={styles.backBtn} onClick={() => navigate('/')}>
                Back
            </button>

            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Neon Text Generator</h1>
                    <p className={styles.subtitle}>
                        Create stunning neon text effects with custom colors, glow intensity, and animations
                    </p>
                </header>

                <section className={styles.innerWrapper}>
                    <div className={styles.controls}>
                        <h2 className={styles.controlsTitle}>Customization</h2>

                        <div className={styles.field}>
                            <label className={styles.label}>Text Content</label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className={styles.input}
                                placeholder="Type your neon text here"
                            />
                        </div>

                        <div className={styles.rowfield}>
                            <div className={styles.field}>
                                <label className={styles.label}>Font Size: {fontSize}px</label>
                                <RangeSlider min={24} max={120} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    trackHeight={20} thumbSize={20} />

                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Glow Intensity: {glowIntensity}px</label>
                                <RangeSlider min={1} max={10} value={glowIntensity} onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                                    trackHeight={20} thumbSize={20} />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Neon Color</label>
                            <div className={styles.colorGrid}>
                                {presetColors.map((preset, index) => (
                                    <button
                                        key={index}
                                        className={styles.colorSwatch}
                                        style={{ backgroundColor: preset }}
                                        onClick={() => setColor(preset)}
                                        aria-label={`Select color ${preset}`}
                                    />
                                ))}
                            </div>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className={styles.colorPicker}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Font Family</label>
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className={styles.select}
                            >
                                <option value="'Arial', sans-serif">Arial</option>
                                <option value="'Helvetica', sans-serif">Helvetica</option>
                                <option value="'Verdana', sans-serif">Verdana</option>
                                <option value="'Courier New', monospace">Courier New</option>
                                <option value="'Impact', sans-serif">Impact</option>
                                <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                            </select>


                            <div className={styles.field}>
                                <label className={styles.label}>Animation</label>
                                <select
                                    value={animation}
                                    onChange={(e) => setAnimation(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="none">None</option>
                                    <option value="pulse">Pulse</option>
                                    <option value="flicker">Flicker</option>
                                </select>
                            </div>

                            <button
                                className={styles.generateBtn}
                                onClick={generateCSS}
                            >
                                Generate CSS Code
                            </button>
                        </div>
                    </div>


                    <div className={styles.right}>
                        <div className={styles.previewSection}>
                            <div className={styles.previewContainer}>
                                <div
                                    ref={textRef}
                                    className={`${styles.neonText} ${animation !== "none" ? styles[animation] : ''}`}
                                    style={{
                                        color: color,
                                        fontFamily: fontFamily,
                                        fontSize: `${fontSize}px`,
                                        textShadow: `
                                    0 0 ${glowIntensity}px currentColor,
                                    0 0 ${glowIntensity * 2}px currentColor,
                                    0 0 ${glowIntensity * 4}px currentColor,
                                    0 0 ${glowIntensity * 8}px currentColor
                                    ${animation !== "none" ? `,
                                    0 0 ${glowIntensity * 12}px ${color},
                                    0 0 ${glowIntensity * 16}px ${color}` : ''}
                                `,
                                    }}
                                >
                                    {text}
                                </div>
                            </div>
                        </div>

                        {cssCode && (
                            <div className={styles.codeSection}>
                                <div className={styles.codeHeader}>
                                    <h3>CSS Code</h3>
                                    <button
                                        id="copyButton"
                                        className={styles.copyBtn}
                                        onClick={copyToClipboard}
                                    >
                                        Copy CSS
                                    </button>
                                </div>
                                <pre className={styles.codeBlock}>
                                    <code>{cssCode}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                </section>
            </div >
        </div>
    );
}