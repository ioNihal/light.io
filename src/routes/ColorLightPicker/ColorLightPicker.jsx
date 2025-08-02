import { useState } from 'react';
import styles from './ColorLightPicker.module.css';
import RangeSlider from '../../components/RangeSlider/RangeSlider';


export default function ColorLightPicker() {
    const [colorVals, setColorVals] = useState({ type: 'hsl', hue: 0, sat: 0, lightnessOrValue: 100 });
    const [isEditing, setIsEditing] = useState(true);
    const [selectBoxOpen, setSelectBoxOpen] = useState(false);

    const handleTypeChange = (type) => {
        setColorVals(prev => ({ ...prev, type: type }))
    };

    const handleSlider = (key, e) => {
        setColorVals(prev => ({ ...prev, [key]: Number(e.target.value) }))
    }


    return (
        <div className={styles.container} style={{ backgroundColor: '' }}>
            <div className={styles.box}>
                {isEditing ? (
                    <>
                        <label className={styles.label} htmlFor="type">
                            Type:&nbsp;<ul className={styles.selectBox} onClick={() => setSelectBoxOpen(prev => !prev)}>
                                <li className={styles.trigger}>{colorVals.type}</li>
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
                            {colorVals.type === 'hsl' ? 'Lightness' : 'Value' }:&nbsp;{colorVals.lightnessOrValue}%
                            <RangeSlider
                                label='lightnessOrValue'
                                min={0} max={100}
                                value={colorVals.lightnessOrValue}
                                onChange={(e) => handleSlider('lightnessOrValue', e)}
                                trackHeight={20}
                                thumbSize={20} />
                        </label>
                    </>
                ) : (
                    <>
                        <h4>Type: {colorVals.type.toUpperCase()}</h4>
                        <p>Hue: {colorVals.hue} Saturation: {colorVals.sat}% {colorVals.type === 'hsl' ? 'Lightness' : 'Brightness'}: {colorVals.lightnessOrValue}%</p>
                        <button className={styles.editBtn}>Edit</button>
                    </>
                )
                }
            </div >
        </div >
    )
}
