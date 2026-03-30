import { useEffect, useMemo, useState } from 'react'
import styles from './KelvinColorPicker.module.css'
import { kelvinToHex, kelvinToRgb } from './helpers.js'
import RangeSlider from '../../components/RangeSlider/RangeSlider.jsx'
import Button from '../../components/Common/Button/Button'
import NumberField from '../../components/Common/NumberField/NumberField'
import CopyButton from '../../components/Common/CopyButton/CopyButton'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

const MIN_K = 1000
const MAX_K = 10000
const STEP = 100
const INITIAL = 2700

export default function KelvinColorPicker() {
  const [kelvin, setKelvin] = useState(INITIAL)
  const [rawKelvin, setRawKelvin] = useState(String(INITIAL))
  const [error, setError] = useState(null)

  const hex = useMemo(() => kelvinToHex(kelvin), [kelvin])
  const rgb = useMemo(() => kelvinToRgb(kelvin), [kelvin])

  const previewSteps = useMemo(() => {
    const points = 6
    const span = 1200
    const start = Math.max(MIN_K, kelvin - span / 2)
    const end = Math.min(MAX_K, kelvin + span / 2)
    const steps = []
    for (let i = 0; i < points; i += 1) {
      const currentKelvin = Math.round(start + (i / (points - 1)) * (end - start))
      steps.push({ k: currentKelvin, hex: kelvinToHex(currentKelvin) })
    }
    return steps
  }, [kelvin])

  useEffect(() => {
    setRawKelvin(String(kelvin))
  }, [kelvin])

  const commitRawKelvin = (valueStr) => {
    const trimmed = String(valueStr || '').trim()
    if (trimmed === '') {
      setRawKelvin(String(kelvin))
      setError(null)
      return
    }

    const value = Number(trimmed)
    if (Number.isNaN(value)) {
      setError('Please enter a numeric Kelvin value.')
      return
    }

    if (value < MIN_K || value > MAX_K) {
      setError(`Kelvin must be between ${MIN_K} and ${MAX_K}.`)
      return
    }

    const rounded = Math.round(value / STEP) * STEP
    const clamped = Math.max(MIN_K, Math.min(MAX_K, rounded))
    setKelvin(clamped)
    setRawKelvin(String(clamped))
    setError(null)
  }

  const presets = [
    { label: 'Candlelight', k: 1900 },
    { label: 'Warm incandescent', k: 2700 },
    { label: 'Soft white', k: 3000 },
    { label: 'Daylight', k: 5500 },
    { label: 'Noon sun', k: 6500 },
  ]

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Current temperature</span>
        <strong>{kelvin} K</strong>
        <p>{hex} and RGB {rgb.r}, {rgb.g}, {rgb.b}</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Temperature guide</span>
        <ul className={styles.tipList}>
          <li>Lower Kelvin values feel warmer and more orange.</li>
          <li>Mid-range values feel neutral and usable for indoor UI examples.</li>
          <li>Higher Kelvin values shift cooler and more blue.</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Kelvin Color Temperature Picker"
      subtitle="Explore light colors from candle warmth through daylight and cool blue-white tones."
      description="Slide or type a Kelvin value, inspect the resulting swatch, and copy the matching HEX or RGB value. The page now follows the same responsive layout and dark-mode styling as the rest of the tools."
      sidebar={sidebar}
    >
      <div className={styles.layout}>
        <section className={styles.panel}>
          {error ? <p className={styles.error}>{error}</p> : null}

          <div className={styles.controlBlock}>
            <label className={styles.label}>
              Temperature
              <span className={styles.kLabel}>{kelvin} K</span>
            </label>

            <RangeSlider
              className={styles.slider}
              type="range"
              min={MIN_K}
              max={MAX_K}
              step={STEP}
              value={kelvin}
              trackHeight={30}
              thumbSize={30}
              onChange={(e) => setKelvin(Number(e.target.value))}
              aria-label="Kelvin temperature slider"
            />

            <NumberField
              label="Exact Kelvin value"
              value={rawKelvin}
              onChange={(e) => setRawKelvin(e.target.value)}
              onBlur={(e) => commitRawKelvin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commitRawKelvin(e.target.value)}
              min={MIN_K}
              max={MAX_K}
              step={STEP}
              placeholder={String(INITIAL)}
              error={error}
            />
          </div>

          <div className={styles.presets}>
            {presets.map((preset) => (
              <Button key={preset.k} variant={kelvin === preset.k ? 'primary' : 'ghost'} size="sm" onClick={() => setKelvin(preset.k)}>
                {preset.label}
              </Button>
            ))}
          </div>
        </section>

        <section className={styles.previewArea}>
          <div className={styles.previewSwatch} style={{ backgroundColor: hex }} aria-hidden="true">
            <div className={styles.previewBadge}>{kelvin}K</div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>HEX</span>
              <code className={styles.code}>{hex}</code>
              <CopyButton text={hex} className={styles.smallBtn} />
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>RGB</span>
              <code className={styles.code}>{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</code>
              <CopyButton text={`${rgb.r}, ${rgb.g}, ${rgb.b}`} className={styles.smallBtn} />
            </div>
          </div>
        </section>

        <section className={styles.gradientPreview}>
          {previewSteps.map((step) => (
            <div key={step.k} className={styles.previewStep} style={{ backgroundColor: step.hex }} title={`${step.k} K`}>
              <div className={styles.stepLabel}>{step.k}K</div>
            </div>
          ))}
        </section>
      </div>
    </ToolPage>
  )
}
