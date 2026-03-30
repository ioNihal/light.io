import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './AutoLightThemeGenerator.module.css'
import { generatePalette } from './generateTheme'
import ThemePreview from './ThemePreview'
import Button from '../../components/Common/Button/Button'
import NumberField from '../../components/Common/NumberField/NumberField'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

export default function AutoLightThemeGenerator() {
  const [brightness, setBrightness] = useState(70)
  const [hue, setHue] = useState(220)
  const [sat, setSat] = useState(80)
  const [count, setCount] = useState(3)
  const [copiedToken, setCopiedToken] = useState(null)
  const [savedColors, setSavedColors] = useState(() => {
    const saved = localStorage.getItem('savedColors')
    return saved ? JSON.parse(saved) : []
  })
  const previewRef = useRef(null)

  const { lightPalette, darkPalette } = useMemo(
    () => generatePalette({ brightness, hue, sat, count }),
    [brightness, hue, sat, count]
  )

  useEffect(() => {
    localStorage.setItem('savedColors', JSON.stringify(savedColors))
  }, [savedColors])

  useEffect(() => {
    if (!copiedToken) return undefined
    const timeout = setTimeout(() => setCopiedToken(null), 2000)
    return () => clearTimeout(timeout)
  }, [copiedToken])

  const handleSave = () => {
    if (savedColors.length >= 5) return
    setSavedColors((current) => [...current, { hue, sat, brightness }])
  }

  const copyToken = async (tokenName, color, name = tokenName) => {
    await navigator.clipboard.writeText(`--${tokenName}: ${color};`)
    setCopiedToken(name)
  }

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Current base</span>
        <div className={styles.colorRow}>
          <span className={styles.colorSwatch} style={{ backgroundColor: `hsl(${hue}, ${sat}%, ${brightness}%)` }} />
          <code>{`hsl(${hue}, ${sat}%, ${brightness}%)`}</code>
        </div>
        <p>{count} token colors per palette, with live light and dark previews.</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Saved palettes</span>
        <div className={styles.savedGrid}>
          {savedColors.length === 0 ? <p className={styles.empty}>No saved themes yet.</p> : null}
          {savedColors.map((color, index) => (
            <div key={`${color.hue}-${color.sat}-${color.brightness}-${index}`} className={styles.savedItem}>
              <span className={styles.savedSwatch} style={{ backgroundColor: `hsl(${color.hue}, ${color.sat}%, ${color.brightness}%)` }} />
              <div className={styles.savedActions}>
                <Button size="sm" onClick={() => {
                  setHue(color.hue)
                  setSat(color.sat)
                  setBrightness(color.brightness)
                }}>
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSavedColors((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Light Theme Generator"
      subtitle="Generate light and dark UI palettes from one base hue, then copy tokens straight into your design system."
      description="Adjust hue, saturation, brightness, and palette size to create a cohesive set of tokens. The paired previews make it easier to validate hierarchy, button contrast, and general visual balance."
      sidebar={sidebar}
      actions={
        <Button onClick={() => previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
          Jump to previews
        </Button>
      }
    >
      <div className={styles.layout}>
        <section className={styles.controls}>
          <div className={styles.segmented}>
            {[3, 4, 5].map((option) => (
              <button
                key={option}
                className={[styles.segment, count === option ? styles.segmentActive : ''].join(' ')}
                onClick={() => setCount(option)}
              >
                {option} colors
              </button>
            ))}
          </div>

          <div className={styles.fieldGrid}>
            <NumberField label="Hue" value={hue} onChange={(e) => setHue(Number(e.target.value))} min={0} max={360} />
            <NumberField label="Saturation" value={sat} onChange={(e) => setSat(Number(e.target.value))} min={0} max={100} />
            <NumberField label="Brightness" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} min={10} max={90} />
          </div>

          <div className={styles.controlActions}>
            <div className={styles.heroSwatch} style={{ backgroundColor: `hsl(${hue}, ${sat}%, ${brightness}%)` }} />
            <Button onClick={handleSave} disabled={savedColors.length >= 5}>
              {savedColors.length >= 5 ? 'Saved limit reached' : 'Save palette'}
            </Button>
          </div>
        </section>

        <section className={styles.previews} ref={previewRef}>
          <ThemePreview
            label="Light Theme"
            palette={lightPalette}
            onCopyToken={copyToken}
            copiedToken={copiedToken}
            type="light"
          />
          <ThemePreview
            label="Dark Theme"
            palette={darkPalette}
            onCopyToken={copyToken}
            copiedToken={copiedToken}
            type="dark"
          />
        </section>
      </div>
    </ToolPage>
  )
}
