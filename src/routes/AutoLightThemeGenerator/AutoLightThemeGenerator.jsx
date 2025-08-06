import { useState, useMemo, useEffect, useRef } from 'react';
import styles from './AutoLightThemeGenerator.module.css';
import { generatePalette } from './generateTheme';
import ThemePreview from './ThemePreview';
import { useNavigate } from 'react-router-dom';

export default function AutoLightThemeGenerator() {
    const [brightness, setBrightness] = useState(70);
    const [hue, setHue] = useState(220);
    const [sat, setSat] = useState(80);
    const [countOpen, setCountOpen] = useState(false);
    const [count, setCount] = useState(3);
    const [copiedToken, setCopiedToken] = useState(null);
    const navigate = useNavigate();

    const selectBoxRef = useRef(null)



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


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectBoxRef.current && !selectBoxRef.current.contains(e.target)) {
                setCountOpen(false)
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const copyToken = (tokenName, color, name = 'default') => {
        navigator.clipboard.writeText(`--${tokenName}: ${color};`);
        setCopiedToken(name);
    }

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate('/')}>Back</button>
            <h2>Auto Light Theme Generator</h2>

            <div className={styles.controls}>
                <label>
                    <span>Brightness:</span>
                    <input
                        type="number" min={10} max={90}
                        value={brightness}
                        onChange={e => setBrightness(+e.target.value)}
                    />
                    %
                </label>

                <label>
                    <span>Hue:</span>
                    <input
                        type="number" min={0} max={360}
                        value={hue}
                        onChange={e => setHue(+e.target.value)}
                    />
                    deg
                </label>

                <label>
                    <span>Saturation:</span>
                    <input
                        type="number" min={0} max={100}
                        value={sat}
                        onChange={e => setSat(+e.target.value)}
                    />
                    %
                </label>

                <label>
                    <span>Palette size:</span>
                    <ul className={styles.selectBox} ref={selectBoxRef}>
                        <li className={`${styles.trigger} ${countOpen ? styles.open : ''}`} onClick={() => setCountOpen(prev => !prev)}>
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
        </div>
    );
}
