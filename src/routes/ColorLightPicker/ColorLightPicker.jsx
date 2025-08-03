import { useState } from 'react';
import styles from './ColorLightPicker.module.css';
import RangeSlider from '../../components/RangeSlider/RangeSlider';
import { useNavigate } from 'react-router-dom';


export default function ColorLightPicker() {
    const [colorVals, setColorVals] = useState({ type: 'hsl', hue: 180, sat: 100, lightnessOrValue: 50 });
    const [isEditing, setIsEditing] = useState(true);
    const [selectBoxOpen, setSelectBoxOpen] = useState(false);

    const navigate = useNavigate();

    const handleTypeChange = (type) => {
        setColorVals(prev => ({ ...prev, type: type }))
    };

    const handleSlider = (key, e) => {
        setColorVals(prev => ({ ...prev, [key]: Number(e.target.value) }))
    }


    return (
        <div className={styles.container} style={{
            backgroundColor: colorVals.type === 'hsl' ?
                `hsl(${colorVals.hue},${colorVals.sat}%,${colorVals.lightnessOrValue}%)` : `hsv(${colorVals.hue},${colorVals.sat}%,${colorVals.lightnessOrValue}%)`
        }}>
             <button className={styles.backBtn} onClick={() => navigate(-1)}>Back</button>
            <div className={styles.box}>
                {isEditing ? (
                    <>
                        <label className={styles.label} htmlFor="type">
                            Type:&nbsp;<ul className={styles.selectBox} onClick={() => setSelectBoxOpen(prev => !prev)}>
                                <li className={`${styles.trigger} ${selectBoxOpen ? styles.open : ''} `}>{colorVals.type}</li>
                                <li className={`${styles.options} ${selectBoxOpen ? styles.open : ''}`}>
                                    <ul>
                                        <li onClick={() => handleTypeChange('hsl')}>hsl</li>
                                        <li onClick={() => handleTypeChange('hsv')}>hsv</li>
                                    </ul>
                                </li>
                            </ul>
                        </label>
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
                        <label className={styles.label} htmlFor="lightnessOrValue">
                            {colorVals.type === 'hsl' ? 'Lightness' : 'Value'}:&nbsp;{colorVals.lightnessOrValue}%
                            <RangeSlider
                                label='lightnessOrValue'
                                min={0} max={100}
                                value={colorVals.lightnessOrValue}
                                onChange={(e) => handleSlider('lightnessOrValue', e)}
                                trackHeight={20}
                                thumbSize={20} />
                        </label>
                        <button className={styles.saveBtn} onClick={() => setIsEditing(prev => !prev)}>Save & Close</button>
                    </>
                ) : (
                    <>
                        <h4>Type: {colorVals.type.toUpperCase()}</h4>
                        <p>Hue: {colorVals.hue}<br />Saturation: {colorVals.sat}%<br />{colorVals.type === 'hsl' ? 'Lightness' : 'Brightness'}: {colorVals.lightnessOrValue}%</p>
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
