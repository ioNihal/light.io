import { useEffect, useState } from 'react';
import styles from './ColorLightPicker.module.css';
import RangeSlider from '../../components/RangeSlider/RangeSlider';
import { useNavigate } from 'react-router-dom';


export default function ColorLightPicker() {
    const [colorVals, setColorVals] = useState({ hue: 180, sat: 100, light: 50 });
    const [isEditing, setIsEditing] = useState(true);
    const [selectBoxOpen, setSelectBoxOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();


    const handleSlider = (key, e) => {
        setColorVals(prev => ({ ...prev, [key]: Number(e.target.value) }))
    }


    const handleCopy = async () => {
        const textToCopy = `hsl(${colorVals.hue},${colorVals.sat}%,${colorVals.light}%)`;

        try {
            await navigator.clipboard.writeText(textToCopy)
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => {
                setCopied(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [copied])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(`.${styles.selectBox}`)) {
                setSelectBoxOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className={styles.container} style={{
            backgroundColor: `hsl(${colorVals.hue},${colorVals.sat}%,${colorVals.light}%)`
        }}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>Back</button>
            <div className={styles.box}>
                <h4>HSL Color Generator</h4>
                {isEditing ? (
                    <>
                        <label className={styles.label} htmlFor="hue">
                            Hue:&nbsp;{colorVals.hue} deg
                            <RangeSlider
                                label='hue'
                                min={0} max={360}
                                value={colorVals.hue}
                                onChange={(e) => handleSlider('hue', e)}
                                trackHeight={20}
                                thumbSize={20} />
                        </label>
                        <label className={styles.label} htmlFor="sat">
                            Saturation:&nbsp;{colorVals.sat}%
                            <RangeSlider
                                label='sat'
                                min={0} max={100}
                                value={colorVals.sat}
                                onChange={(e) => handleSlider('sat', e)}
                                trackHeight={20}
                                thumbSize={20} />
                        </label>
                        <label className={styles.label} htmlFor="light">
                            Lightness:&nbsp;{colorVals.light}%
                            <RangeSlider
                                label='light'
                                min={0} max={100}
                                value={colorVals.light}
                                onChange={(e) => handleSlider('light', e)}
                                trackHeight={20}
                                thumbSize={20} />
                        </label>
                        <button className={styles.saveBtn} onClick={() => setIsEditing(prev => !prev)}>Save & Close</button>
                    </>
                ) : (
                    <>
                        <p>Hue:&nbsp;{colorVals.hue}<br />Saturation:&nbsp;{colorVals.sat}%<br />Lightness:&nbsp;{colorVals.light}%</p>
                        <button className={styles.copyBtn} onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
                        <button className={styles.editBtn} onClick={() => {
                            setSelectBoxOpen(false);
                            setIsEditing(prev => !prev);
                        }}>Edit</button>
                    </>
                )
                }
            </div >
        </div >
    )
}
