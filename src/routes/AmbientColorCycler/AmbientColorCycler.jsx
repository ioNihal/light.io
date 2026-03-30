import { useEffect, useState } from 'react'
import styles from './AmbientColorCycler.module.css'
import RangeSlider from '../../components/RangeSlider/RangeSlider'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

const ambientColors = [
  '#ff8383ff',
  '#FFD6A5',
  '#FDFFB6',
  '#CAFFBF',
  '#9BF6FF',
  '#A0C4FF',
  '#BDB2FF',
  '#FFC6FF',
]

export default function AmbientColorCycler() {
  const [colorIndex, setColorIndex] = useState(0)
  const [speed, setSpeed] = useState(3000)

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % ambientColors.length)
    }, speed)
    return () => clearInterval(interval)
  }, [speed])

  const activeColor = ambientColors[colorIndex]

  return (
    <ToolPage
      title="Ambient Color Cycler"
      subtitle="Create a slow, room-like wash of color to test mood, atmosphere, and passive lighting transitions."
      description="Use the speed slider to move between a subtle ambient drift and a more noticeable cycle. The preview adapts cleanly from mobile to widescreen."
      meta={
        <>
          <span className={styles.metaLabel}>Current tone</span>
          <strong className={styles.metaValue}>{activeColor}</strong>
        </>
      }
    >
      <div className={styles.layout}>
        <section className={styles.controls}>
          <label className={styles.label}>
            Cycle speed
            <span>{speed} ms</span>
          </label>
          <RangeSlider
            label="speed_slider"
            id="speedSlider"
            min={500}
            max={6000}
            step={250}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            trackHeight={32}
            thumbSize={28}
          />
          <p className={styles.helper}>Lower values feel energetic. Higher values feel more like slow ambient lighting.</p>
        </section>

        <section className={styles.stage}>
          <div className={styles.preview} style={{ backgroundColor: activeColor, transitionDuration: `${speed}ms` }}>
            <div className={styles.previewOverlay}>
              <span>Ambient preview</span>
              <strong>{activeColor}</strong>
            </div>
          </div>
        </section>
      </div>
    </ToolPage>
  )
}
