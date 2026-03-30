import { useMemo, useRef, useState } from 'react'
import styles from './WhitePaletteGenerator.module.css'
import { generateTintedWhites, randomPastelTint } from './helpers.js'
import ToolPage from '../../components/Common/ToolPage/ToolPage'
import Field from '../../components/Common/Field/Field'
import Button from '../../components/Common/Button/Button'
import NumberField from '../../components/Common/NumberField/NumberField'

export default function WhitePaletteGenerator() {
  const [tint, setTint] = useState('#FFF6E8')
  const [rawTint, setRawTint] = useState('#FFF6E8')
  const [count, setCount] = useState(5)
  const [rawCount, setRawCount] = useState('5')
  const [tintError, setTintError] = useState(null)
  const [countError, setCountError] = useState(null)
  const [copied, setCopied] = useState(null)
  const debounceRef = useRef(null)

  const shades = useMemo(() => generateTintedWhites(tint, count, 0.84), [tint, count])

  const syncTint = (value) => {
    setTint(value.toUpperCase())
    setRawTint(value.toUpperCase())
    setTintError(null)
  }

  const handleColorPicker = (e) => {
    const value = e.target.value
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      syncTint(value)
    }, 120)
  }

  const commitTint = () => {
    const value = rawTint.trim()
    if (/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value)) {
      syncTint(value)
      return
    }

    setRawTint(tint)
    setTintError('Enter a valid hex color such as #FFF or #FFF6E8.')
  }

  const commitCount = () => {
    const num = parseInt(rawCount || '0', 10)
    if (!Number.isNaN(num) && num >= 2 && num <= 24) {
      setCount(num)
      setRawCount(String(num))
      setCountError(null)
      return
    }

    setRawCount(String(count))
    setCountError('Choose between 2 and 24 shades for a useful palette.')
  }

  const copy = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      setTimeout(() => setCopied(null), 1200)
    } catch (error) {
      console.error('Failed to copy color', error)
    }
  }

  const sidebar = (
    <>
      <div className={styles.infoCard}>
        <span className={styles.infoLabel}>Current tint</span>
        <div className={styles.tintChipRow}>
          <span className={styles.tintChip} style={{ backgroundColor: tint }} />
          <code>{tint}</code>
        </div>
        <p>{count} generated stops, from the source tint up to clean white.</p>
      </div>

      <div className={styles.infoCard}>
        <span className={styles.infoLabel}>Useful for</span>
        <ul className={styles.list}>
          <li>Surface stacks and card hierarchies</li>
          <li>Subtle panel and divider backgrounds</li>
          <li>Warm, soft UI systems that avoid pure gray</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="White Palette Generator"
      subtitle="Build soft off-white ramps for surfaces, cards, borders, and layered neutral systems."
      description="Each swatch moves from your chosen tint toward true white. Duplicate near-white values are filtered out so the palette stays usable."
      meta={
        <>
          <span className={styles.metaLabel}>Palette size</span>
          <strong className={styles.metaValue}>{shades.length} swatches</strong>
        </>
      }
      sidebar={sidebar}
    >
      <div className={styles.panel}>
        <div className={styles.controls}>
          <Field label="Tint source" error={tintError}>
            <div className={styles.tintRow}>
              <input
                type="color"
                value={tint}
                onChange={handleColorPicker}
                className={styles.colorInput}
                aria-label="Tint color picker"
              />
              <input
                type="text"
                value={rawTint}
                onChange={(e) => setRawTint(e.target.value)}
                onBlur={commitTint}
                onKeyDown={(e) => e.key === 'Enter' && commitTint()}
                className={styles.textInput}
                placeholder="#FFF6E8"
                aria-label="Tint color input"
              />
              <Button onClick={() => syncTint(randomPastelTint())}>Random tint</Button>
            </div>
          </Field>

          <NumberField
            label="Number of shades"
            value={rawCount}
            onChange={(e) => setRawCount(e.target.value)}
            onBlur={commitCount}
            onKeyDown={(e) => e.key === 'Enter' && commitCount()}
            min={2}
            max={24}
            step={1}
            placeholder="5"
            error={countError}
          />
          <div className={styles.quickActions}>
            {[4, 6, 8, 12].map((preset) => (
              <Button key={preset} variant={count === preset ? 'primary' : 'ghost'} size="sm" onClick={() => {
                setCount(preset)
                setRawCount(String(preset))
                setCountError(null)
              }}>
                {preset} tones
              </Button>
            ))}
          </div>
        </div>

        <section className={styles.paletteGrid}>
          {shades.map((hex, index) => (
            <button
              key={`${hex}-${index}`}
              onClick={() => copy(hex)}
              className={styles.colorTile}
              style={{ backgroundColor: hex }}
              title={`Copy ${hex}`}
            >
              <div className={styles.tileTop}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {copied === hex ? <span className={styles.copied}>Copied</span> : <span className={styles.copyHint}>Tap to copy</span>}
              </div>
              <div className={styles.tileFooter}>
                <code className={styles.hexLabel}>{hex}</code>
              </div>
            </button>
          ))}
        </section>
      </div>
    </ToolPage>
  )
}
