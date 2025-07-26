import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeProvider";
import styles from "./ScreenLight.module.css";
import { useNavigate } from "react-router-dom";

function ScreenLight() {
    const [screenLightOn, setScreenLightOn] = useState(false);
    const [brightness, setBrightness] = useState(100);

    const { theme, toggle } = useTheme();

    const navigate = useNavigate();

    const handleChange = () => {
        setScreenLightOn(prev => !prev);
        if(brightness < 100) setBrightness(100)
    }

    useEffect(() => {
        if (screenLightOn && theme === 'dark') {
            toggle();
        }
        if (!screenLightOn) {
            toggle();
        }
    }, [screenLightOn])

    useEffect(() => {
        if (brightness <= 50 && theme === 'light') {
            toggle();
        }
        if (brightness > 50 && theme === 'dark') {
            toggle();
        }

    }, [brightness]);

    const bgColor = screenLightOn
        ? `hsl(0, 0%, ${brightness}%)`
        : "var(--color-bg)";

    return (
        <div className={styles.container} style={{ backgroundColor: bgColor }}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>BACK</button>
            <div className={styles.controls}>
                <div className={styles.toggles}>
                    <button
                        className={screenLightOn ? styles.active : ""}
                        onClick={handleChange}
                    >
                        {screenLightOn ? 'TURN OFF' : 'TURN ON'}
                    </button>
                </div>


                <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    disabled={!screenLightOn}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className={`${styles.slider} ${!screenLightOn ? styles.hide : ''}`}
                />
                <span className={`${styles.indicator} ${!screenLightOn ? styles.hide : ''}`}>Brightness: {brightness}</span>
            </div>
        </div>
    );
}

export default ScreenLight;
