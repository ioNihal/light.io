import { useEffect, useState } from 'react';
import styles from './AmbientColorCycler.module.css';

const ambientColors = [
    '#FFADAD', // soft red
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
    const [speed, setSpeed] = useState(4000);

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
            <input
                type='range'
                name='slider'
                id='slider'
                min='0'
                max='10000'
                step="500"
                className={styles.slider}
                onChange={handleSpeed} />
                <p style={{ color: '#222' }}>{speed} ms</p>
        </div>
    )
}
