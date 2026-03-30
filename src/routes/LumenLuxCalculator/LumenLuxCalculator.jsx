import { useState } from 'react'
import styles from './LumenLuxCalculator.module.css'
import { calcArea, calcLumens, calcLux } from './helpers'
import NumberField from '../../components/Common/NumberField/NumberField'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

export default function LumenLuxCalculator() {
  const [lumens, setLumens] = useState('')
  const [lux, setLux] = useState('')
  const [area, setArea] = useState('')
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setError('')

    const currentLumens = parseFloat(lumens) || 0
    const currentLux = parseFloat(lux) || 0
    const currentArea = parseFloat(area) || 0
    const nextValue = value === '' ? '' : parseFloat(value)

    if (nextValue < 0) {
      setError('Values cannot be negative.')
      if (field === 'lumens') setLumens(value)
      if (field === 'lux') setLux(value)
      if (field === 'area') setArea(value)
      return
    }

    if (field === 'lumens') {
      setLumens(value)
      if (currentArea > 0) setLux(calcLux(nextValue, currentArea).toFixed(2))
      else if (currentLux > 0) setArea(calcArea(nextValue, currentLux).toFixed(2))
    } else if (field === 'lux') {
      setLux(value)
      if (currentArea > 0) setLumens(calcLumens(nextValue, currentArea).toFixed(2))
      else if (currentLumens > 0) setArea(calcArea(currentLumens, nextValue).toFixed(2))
    } else {
      setArea(value)
      if (currentLux > 0) setLumens(calcLumens(currentLux, nextValue).toFixed(2))
      else if (currentLumens > 0) setLux(calcLux(currentLumens, nextValue).toFixed(2))
    }
  }

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Lighting formulas</span>
        <ul className={styles.tipList}>
          <li>Lux = Lumens / Area</li>
          <li>Lumens = Lux x Area</li>
          <li>Area = Lumens / Lux</li>
        </ul>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Common targets</span>
        <ul className={styles.tipList}>
          <li>100-300 lux for living rooms</li>
          <li>300-500 lux for study and office work</li>
          <li>500-1000 lux for task-heavy spaces</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Lumen Lux Calculator"
      subtitle="Quickly convert between light output, illuminance, and lit area."
      description="Enter any two values and the third updates automatically. This layout keeps the calculator legible on phones while still feeling roomy on desktop."
      sidebar={sidebar}
    >
      <div className={styles.panel}>
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.inputGrid}>
          <NumberField label="Lumens" value={lumens} onChange={(e) => handleChange('lumens', e.target.value)} />
          <NumberField label="Lux" value={lux} onChange={(e) => handleChange('lux', e.target.value)} />
          <NumberField label="Area (m2)" value={area} onChange={(e) => handleChange('area', e.target.value)} />
        </div>
      </div>
    </ToolPage>
  )
}
