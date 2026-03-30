import { useEffect, useState } from 'react'
import styles from './ColorFormatConverter.module.css'
import { rgbToHex, rgbToHsl, hslToRgb, hexToRgb as parseHex } from './helper'
import Field from '../../components/Common/Field/Field'
import CopyButton from '../../components/Common/CopyButton/CopyButton'
import Button from '../../components/Common/Button/Button'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

export default function ColorFormatConverter() {
  const [hex, setHex] = useState('#FF7A59')
  const [rgb, setRgb] = useState({ r: 255, g: 122, b: 89 })
  const [hsl, setHsl] = useState({ h: 13, s: 100, l: 67 })
  const [rawHex, setRawHex] = useState('#FF7A59')
  const [rawRgb, setRawRgb] = useState('255, 122, 89')
  const [rawHsl, setRawHsl] = useState('13, 100%, 67%')
  const [error, setError] = useState(null)

  useEffect(() => {
    setRawHex(hex)
    setRawRgb(`${rgb.r}, ${rgb.g}, ${rgb.b}`)
    setRawHsl(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`)
  }, [hex, rgb, hsl])

  const commitHex = (value) => {
    const parsed = parseHex(value.trim())
    if (!parsed) {
      setError('Use #RGB or #RRGGBB for HEX input.')
      return
    }

    const normalizedHex = rgbToHex(parsed.r, parsed.g, parsed.b)
    setHex(normalizedHex)
    setRgb(parsed)
    setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b))
    setError(null)
  }

  const commitRgb = (value) => {
    const parts = value.split(/[, ]+/).map((part) => part.replace('%', '').trim()).filter(Boolean)
    if (parts.length !== 3) {
      setError('RGB needs three integers like 255, 122, 89.')
      return
    }

    const [r, g, b] = parts.map((part) => parseInt(part, 10))
    if ([r, g, b].some((item) => Number.isNaN(item) || item < 0 || item > 255)) {
      setError('Each RGB value must stay between 0 and 255.')
      return
    }

    setRgb({ r, g, b })
    setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b))
    setError(null)
  }

  const commitHsl = (value) => {
    const parts = value.replaceAll('%', '').split(/[, ]+/).map((part) => part.trim()).filter(Boolean)
    if (parts.length !== 3) {
      setError('HSL needs three values like 13, 100, 67.')
      return
    }

    const h = Number(parts[0])
    const s = Number(parts[1])
    const l = Number(parts[2])

    if (
      Number.isNaN(h) || h < 0 || h > 360 ||
      Number.isNaN(s) || s < 0 || s > 100 ||
      Number.isNaN(l) || l < 0 || l > 100
    ) {
      setError('Hue must be 0-360 and saturation/lightness must be 0-100.')
      return
    }

    const nextRgb = hslToRgb(h, s, l)
    setHsl({ h: Math.round(h), s: Math.round(s), l: Math.round(l) })
    setRgb(nextRgb)
    setHex(rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b))
    setError(null)
  }

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Current swatch</span>
        <div className={styles.swatch} style={{ backgroundColor: hex }} />
        <code className={styles.code}>{hex}</code>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Accepted formats</span>
        <ul className={styles.ruleList}>
          <li>HEX: `#RGB` or `#RRGGBB`</li>
          <li>RGB: `R, G, B` between 0 and 255</li>
          <li>HSL: `H, S, L` with hue up to 360</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Color Format Converter"
      subtitle="Convert between HEX, RGB, and HSL while keeping one live color preview in sync."
      description="Edit any format, press Enter or blur the field, and the other formats update instantly. Handy for UI audits, handoff notes, and CSS-ready values."
      sidebar={sidebar}
    >
      <div className={styles.panel}>
        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.row}>
          <div className={styles.fieldCard}>
            <Field label="HEX" error={error?.includes('HEX') ? error : null}>
              <input
                className={styles.input}
                value={rawHex}
                onChange={(e) => setRawHex(e.target.value)}
                onBlur={(e) => commitHex(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && commitHex(e.target.value)}
              />
            </Field>
            <div className={styles.actions}>
              <Button onClick={() => commitHex(rawHex)}>Apply</Button>
              <CopyButton text={hex} />
            </div>
          </div>

          <div className={styles.preview} style={{ backgroundColor: hex }}>
            <div className={styles.previewBadge}>{hex}</div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldCard}>
            <Field label="RGB" error={error?.includes('RGB') ? error : null}>
              <input
                className={styles.input}
                value={rawRgb}
                onChange={(e) => setRawRgb(e.target.value)}
                onBlur={(e) => commitRgb(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && commitRgb(e.target.value)}
              />
            </Field>
            <div className={styles.actions}>
              <Button onClick={() => commitRgb(rawRgb)}>Apply</Button>
              <CopyButton text={`${rgb.r}, ${rgb.g}, ${rgb.b}`} />
            </div>
          </div>

          <div className={styles.fieldCard}>
            <Field label="HSL" error={error?.includes('Hue') || error?.includes('HSL') ? error : null}>
              <input
                className={styles.input}
                value={rawHsl}
                onChange={(e) => setRawHsl(e.target.value)}
                onBlur={(e) => commitHsl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && commitHsl(e.target.value)}
              />
            </Field>
            <div className={styles.actions}>
              <Button onClick={() => commitHsl(rawHsl)}>Apply</Button>
              <CopyButton text={`${hsl.h}, ${hsl.s}%, ${hsl.l}%`} />
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  )
}
