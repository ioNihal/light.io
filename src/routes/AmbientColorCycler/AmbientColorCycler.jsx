import { useEffect, useState } from 'react';
import styles from './AmbientColorCycler.module.css';
import { useNavigate } from 'react-router-dom';
import RangeSlider from '../../components/RangeSlider/RangeSlider';

const ambientColors = [
    '#ff8383ff', // soft red
    '#FFD6A5', // peach
    '#FDFFB6', // light yellow
    '#CAFFBF', // mint green
    '#9BF6FF', // soft blue
    '#A0C4FF', // periwinkle
    '#BDB2FF', // lavender
    '#FFC6FF', // pinkish purple
];

export default function AmbientColorCycler() {

    const [colorIndex, setColorIndex] = useState(0);
    const [speed, setSpeed] = useState(3000);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setColorIndex(prev => (prev + 1) % ambientColors.length)
        }, speed)
        return () => clearInterval(interval);
    }, [speed])

    const handleSpeed = (e) => {
        setSpeed(Number(e.target.value));
    }

    return (
        <div className={styles.container} style={{ backgroundColor: ambientColors[colorIndex], transitionDuration: `${speed}ms` }}>
            <button className={styles.backBtn} onClick={() => navigate('/')}>Back</button>
            <div className={styles.sliderWrapper}>
                <p className={styles.indicator}>Slide to change speed</p>
                <RangeSlider
                    label='speed_slider'
                    id='speedSlider'
                    min={0}
                    max={6000}
                    step={500}
                    value={speed}
                    onChange={handleSpeed}
                    trackHeight={35}
                    thumbSize={35} />
                <p className={styles.indicator}>{speed} ms</p>
            </div>
        </div>
    )
}
