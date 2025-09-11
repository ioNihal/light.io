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

    const previewBoxRef = useRef(null);

    const { lightPalette, darkPalette } = useMemo(
        () => generatePalette({ brightness, hue, sat, count }),
        [brightness, hue, sat, count]
    );

    useEffect(() => {
        if (copiedToken) {
            const timeout = setTimeout(() => {
                setCopiedToken(null);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [copiedToken])

    const handleScroll = () => {
        if (previewBoxRef.current) {
            previewBoxRef.current.scrollIntoView({
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
                    <button className={styles.saveBtn}>Save</button>
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

            <div className={styles.scrollBtn} onClick={handleScroll}>
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

            <p className={styles.description}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nesciunt. Sequi nostrum veritatis dolorum natus debitis dolorem hic eaque, cumque dignissimos impedit harum, magnam illum fuga unde ipsa rerum ut.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nesciunt. Sequi nostrum veritatis dolorum natus debitis dolorem hic eaque, cumque dignissimos impedit harum, magnam illum fuga unde ipsa rerum ut.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nesciunt. Sequi nostrum veritatis dolorum natus debitis dolorem hic eaque, cumque dignissimos impedit harum, magnam illum fuga unde ipsa rerum ut.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nesciunt. Sequi nostrum veritatis dolorum natus debitis dolorem hic eaque, cumque dignissimos impedit harum, magnam illum fuga unde ipsa rerum ut.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nesciunt. Sequi nostrum veritatis dolorum natus debitis dolorem hic eaque, cumque dignissimos impedit harum, magnam illum fuga unde ipsa rerum ut.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nesciunt. Sequi nostrum veritatis dolorum natus debitis dolorem hic eaque, cumque dignissimos impedit harum, magnam illum fuga unde ipsa rerum ut.
                s
            </p>
        </div>
    );
}
