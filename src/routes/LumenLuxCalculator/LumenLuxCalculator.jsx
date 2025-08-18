import { useState } from 'react';
import styles from './LumenLuxCalculator.module.css';
import { calcArea, calcLumens, calcLux } from './helpers';
import { useNavigate } from 'react-router-dom';

export default function LumenLuxCalculator() {
    const [lumens, setLumens] = useState("");
    const [lux, setLux] = useState("");
    const [area, setArea] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();



    const handleChange = (field, value) => {
        setError("");


        let l = parseFloat(lumens) || 0;
        let lx = parseFloat(lux) || 0;
        let a = parseFloat(area) || 0;


        const v = value === "" ? "" : parseFloat(value);

        if (v < 0) {
            setError("Values cannot be negative.");
            if (field === "lumens") setLumens(value);
            if (field === "lux") setLux(value);
            if (field === "area") setArea(value);
            return;
        }

        if (field === "lumens") {
            setLumens(value);
            if (a > 0) setLux(calcLux(v, a).toFixed(2));
            else if (lx > 0) setArea(calcArea(v, lx).toFixed(2));
        }
        else if (field === "lux") {
            setLux(value);
            if (a > 0) setLumens(calcLumens(v, a).toFixed(2));
            else if (l > 0) setArea(calcArea(l, v).toFixed(2));
        }
        else if (field === "area") {
            setArea(value);
            if (lx > 0) setLumens(calcLumens(lx, v).toFixed(2));
            else if (l > 0) setLux(calcLux(l, v).toFixed(2));
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate("/")}>
                Back
            </button>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Lumen&nbsp;&nbsp;⇄&nbsp;&nbsp;Lux&nbsp;Calculator</h2>
                    <p className={styles.subtitle}>
                        Convert between lumens, lux and area for Room/Studio lighting.
                    </p>
                </header>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.inputsWrapper}>
                    <div className={styles.inputGroup}>
                        <label>Lumens</label>
                        <input
                            type="number"
                            value={lumens}
                            placeholder='0'
                            onChange={(e) => handleChange("lumens", e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Lux</label>
                        <input
                            type="number"
                            value={lux}
                            placeholder='0'
                            onChange={(e) => handleChange("lux", e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Area (m<sup>2</sup>)</label>
                        <input
                            type="number"
                            value={area}
                            placeholder='0'
                            onChange={(e) => handleChange("area", e.target.value)}
                        />
                    </div>
                </div>


                <div className={styles.tips}>
                    <h4>Quick Tips</h4>
                    <ul>
                        <li><strong>Lux&nbsp;=&nbsp;Lumens&nbsp;÷&nbsp;Area</strong> brightness per square meter</li>
                        <li><strong>Lumens&nbsp;=&nbsp;Lux&nbsp;×&nbsp;Area</strong> total light needed</li>
                        <li><strong>Area&nbsp;=&nbsp;Lumens&nbsp;÷&nbsp;Lux</strong> coverage size</li>
                        <li><strong>~100-300&nbsp;lux</strong>Living rooms</li>
                        <li><strong>~300-500&nbsp;lux</strong>Offices/Study</li>
                        <li><strong>~500-1000&nbsp;lux</strong>Workshops/Kitchens</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
