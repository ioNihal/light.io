import { useEffect, useMemo, useState } from 'react'
import styles from './ContrastRatio.module.css'
import { normalizeHex, wcagResults, getContrast } from './contrastHelpers'
import ColorField from '../../components/Common/ColorField/ColorField'
import Badge from '../../components/Common/Badge/Badge'
import Button from '../../components/Common/Button/Button'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

export default function ContrastRatio() {
  const [textColor, setTextColor] = useState('#111827')
  const [bgColor, setBgColor] = useState('#F8FAFC')
  const [fontIsLarge, setFontIsLarge] = useState(false)
  const [ratio, setRatio] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      setError('')
      setRatio(getContrast(textColor, bgColor))
    } catch (currentError) {
      setRatio(null)
      setError(currentError.message || 'Invalid color')
    }
  }, [textColor, bgColor])

  const presets = [
    { label: 'Body copy', text: '#111827', bg: '#F8FAFC' },
    { label: 'Dark mode', text: '#F9FAFB', bg: '#111827' },
    { label: 'Muted text', text: '#6B7280', bg: '#FFFFFF' },
    { label: 'Warning UI', text: '#1D4ED8', bg: '#FEF3C7' },
  ]

  const displayRatio = ratio ? ratio.toFixed(2) : '--'
  const results = ratio ? wcagResults(ratio) : null
  const activeResult = useMemo(() => {
    if (!results) return 'Waiting for valid colors'
    if (fontIsLarge) {
      return results.aaaLarge ? 'AAA large text' : results.aaLarge ? 'AA large text' : 'Fails large text'
    }
    return results.aaaNormal ? 'AAA normal text' : results.aaNormal ? 'AA normal text' : 'Fails normal text'
  }, [fontIsLarge, results])

  const sidebar = (
    <>
      <div className={styles.metricCard}>
        <span className={styles.metricLabel}>Contrast ratio</span>
        <strong className={styles.metricValue}>{displayRatio}:1</strong>
        <p>{activeResult}</p>
      </div>

      <div className={styles.metricCard}>
        <span className={styles.metricLabel}>Quick guidance</span>
        <ul className={styles.notesList}>
          <li>AA needs 4.5:1 for normal text and 3:1 for large text.</li>
          <li>AAA needs 7:1 for normal text and 4.5:1 for large text.</li>
          <li>Pure black on pure white reaches the maximum 21:1 contrast.</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Contrast Ratio Checker"
      subtitle="Audit foreground and background color pairs against WCAG requirements with an instant visual preview."
      description="Use presets for common UI scenarios, compare accessibility thresholds, and test how your pairing behaves for normal or large text."
      sidebar={sidebar}
      actions={
        <label className={styles.toggle}>
          <input type="checkbox" checked={fontIsLarge} onChange={(e) => setFontIsLarge(e.target.checked)} />
          <span>Large text mode</span>
        </label>
      }
    >
      <div className={styles.layout}>
        <section className={styles.panel}>
          <div className={styles.fields}>
            <ColorField
              label="Text color"
              color={normalizeHex(textColor)}
              hexValue={normalizeHex(textColor)}
              onColorChange={(e) => setTextColor(e.target.value)}
              onHexChange={(e) => setTextColor(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
              onCopy={() => {}}
              error={error}
              placeholder="#111827"
            />

            <ColorField
              label="Background color"
              color={normalizeHex(bgColor)}
              hexValue={normalizeHex(bgColor)}
              onColorChange={(e) => setBgColor(e.target.value)}
              onHexChange={(e) => setBgColor(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
              onCopy={() => {}}
              error={error}
              placeholder="#F8FAFC"
            />
          </div>

          <div className={styles.presetRow}>
            {presets.map((preset) => (
              <Button key={preset.label} variant="ghost" size="sm" onClick={() => {
                setTextColor(preset.text)
                setBgColor(preset.bg)
              }}>
                {preset.label}
              </Button>
            ))}
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}
        </section>

        <section
          className={styles.previewCard}
          style={{ color: normalizeHex(textColor), backgroundColor: normalizeHex(bgColor) }}
        >
          <div className={styles.previewInner}>
            <span className={styles.previewEyebrow}>Preview</span>
            <p className={fontIsLarge ? styles.sampleLarge : styles.sample}>
              The quick brown fox jumps over the lazy dog.
            </p>
            <p className={styles.previewMeta}>
              {fontIsLarge ? 'Large text sample' : 'Normal body text sample'}
            </p>
          </div>
        </section>

        {results ? (
          <section className={styles.results}>
            <Badge label="AA normal" pass={results.aaNormal} />
            <Badge label="AA large" pass={results.aaLarge} />
            <Badge label="AAA normal" pass={results.aaaNormal} />
            <Badge label="AAA large" pass={results.aaaLarge} />
          </section>
        ) : null}
      </div>
    </ToolPage>
  )
}
