import { useState } from 'react'
import styles from './ColorLightPicker.module.css'
import RangeSlider from '../../components/RangeSlider/RangeSlider'
import ToolPage from '../../components/Common/ToolPage/ToolPage'
import CopyButton from '../../components/Common/CopyButton/CopyButton'
import Button from '../../components/Common/Button/Button'

export default function ColorLightPicker() {
  const [colorVals, setColorVals] = useState({ hue: 180, sat: 100, light: 50 })
  const [isEditing, setIsEditing] = useState(true)

  const hslValue = `hsl(${colorVals.hue}, ${colorVals.sat}%, ${colorVals.light}%)`

  const setValue = (key, value) => {
    setColorVals((prev) => ({ ...prev, [key]: Number(value) }))
  }

  return (
    <ToolPage
      title="Color Light Picker"
      subtitle="Dial in a full-screen HSL color for mood checks, light-box use, or quick color testing."
      description="Adjust hue, saturation, and lightness, then collapse the editor for a cleaner full-color preview. The controls are designed to stay usable on touch devices too."
      meta={
        <>
          <span className={styles.metaLabel}>Current color</span>
          <strong className={styles.metaValue}>{hslValue}</strong>
        </>
      }
      actions={
        <Button variant="ghost" size="sm" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? 'Focus preview' : 'Edit color'}
        </Button>
      }
    >
      <div className={styles.layout}>
        <section className={styles.stage}>
          <div className={styles.preview} style={{ backgroundColor: hslValue }}>
            <div className={styles.previewBadge}>{hslValue}</div>
          </div>
        </section>

        <section className={styles.panel}>
          {isEditing ? (
            <div className={styles.controls}>
              <label className={styles.control}>
                <span>Hue</span>
                <strong>{colorVals.hue} deg</strong>
                <RangeSlider min={0} max={360} value={colorVals.hue} onChange={(e) => setValue('hue', e.target.value)} trackHeight={20} thumbSize={20} />
              </label>

              <label className={styles.control}>
                <span>Saturation</span>
                <strong>{colorVals.sat}%</strong>
                <RangeSlider min={0} max={100} value={colorVals.sat} onChange={(e) => setValue('sat', e.target.value)} trackHeight={20} thumbSize={20} />
              </label>

              <label className={styles.control}>
                <span>Lightness</span>
                <strong>{colorVals.light}%</strong>
                <RangeSlider min={0} max={100} value={colorVals.light} onChange={(e) => setValue('light', e.target.value)} trackHeight={20} thumbSize={20} />
              </label>

              <div className={styles.actionRow}>
                <CopyButton text={hslValue} />
                <Button onClick={() => setIsEditing(false)}>Hide controls</Button>
              </div>
            </div>
          ) : (
            <div className={styles.summary}>
              <p>{hslValue}</p>
              <div className={styles.actionRow}>
                <CopyButton text={hslValue} />
                <Button onClick={() => setIsEditing(true)}>Edit again</Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </ToolPage>
  )
}
