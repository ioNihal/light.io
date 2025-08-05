import { useState, useMemo } from 'react';
import styles from './AutoLightThemeGenerator.module.css';
import { generatePalette } from './generateTheme';
import ThemePreview from './ThemePreview';

export default function AutoLightThemeGenerator() {
    const [brightness, setBrightness] = useState(70);
    const [hue, setHue] = useState(220);
    const [sat, setSat] = useState(80);
    const [countOpen, setCountOpen] = useState(false);
    const [count, setCount] = useState(3);

    const { lightPalette, darkPalette } = useMemo(
        () => generatePalette({ brightness, hue, sat, count }),
        [brightness, hue, sat, count]
    );


    const copyToken = (tokenName, color) =>
        navigator.clipboard.writeText(`--${tokenName}: ${color};`);

    return (
        <div className={styles.container}>
            <h2>Auto Light Theme Generator</h2>

            <div className={styles.controls}>
                <label>
                    Brightness:
                    <input
                        type="number" min={10} max={90}
                        value={brightness}
                        onChange={e => setBrightness(+e.target.value)}
                    />%
                </label>

                <label>
                    Hue:
                    <input
                        type="number" min={0} max={360}
                        value={hue}
                        onChange={e => setHue(+e.target.value)}
                    />
                </label>

                <label>
                    Saturation:
                    <input
                        type="number" min={0} max={100}
                        value={sat}
                        onChange={e => setSat(+e.target.value)}
                    />%
                </label>

                <label>
                    Palette size:
                    <ul className={styles.selectBox} onClick={() => setCountOpen(prev => !prev)}>
                        <li className={`${styles.trigger} ${countOpen ? styles.open : ''}`}>
                            {count} colors
                        </li>
                        <li className={`${styles.options} ${countOpen ? styles.open : ''}`}>
                            <ul>
                                {[3, 4, 5].map(n => (
                                    <li key={n} onClick={() => {
                                        setCount(n);
                                        setCountOpen(false);
                                    }}>
                                        {n} colors
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>

                </label>
            </div>

            <div className={styles.previewBox}>
                <ThemePreview
                    label="Light Theme"
                    palette={lightPalette}
                    onCopyToken={copyToken}
                />
                <ThemePreview
                    label="Dark Theme"
                    palette={darkPalette}
                    onCopyToken={copyToken}
                />
            </div>
        </div>
    );
}
