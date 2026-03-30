import { useRef, useState } from 'react'
import styles from './NeonTextGenerator.module.css'
import RangeSlider from '../../components/RangeSlider/RangeSlider'
import Button from '../../components/Common/Button/Button'
import CopyButton from '../../components/Common/CopyButton/CopyButton'
import Field from '../../components/Common/Field/Field'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

export default function NeonTextGenerator() {
  const [text, setText] = useState('Your Neon Text')
  const [color, setColor] = useState('#ff00ff')
  const [fontFamily, setFontFamily] = useState("'Arial', sans-serif")
  const [glowIntensity, setGlowIntensity] = useState(5)
  const [fontSize, setFontSize] = useState(48)
  const [animation, setAnimation] = useState('none')
  const [cssCode, setCssCode] = useState('')
  const textRef = useRef(null)

  const generateCSS = () => {
    const css = `
.neon-text {
  color: ${color};
  font-family: ${fontFamily};
  font-size: ${fontSize}px;
  font-weight: bold;
  text-shadow:
    0 0 ${glowIntensity}px currentColor,
    0 0 ${glowIntensity * 2}px currentColor,
    0 0 ${glowIntensity * 4}px currentColor,
    0 0 ${glowIntensity * 8}px currentColor${animation !== 'none' ? `,
    0 0 ${glowIntensity * 12}px ${color},
    0 0 ${glowIntensity * 16}px ${color}` : ''};
  ${animation !== 'none' ? `animation: ${animation} 1.5s ease-in-out infinite alternate;` : ''}
}
    `.trim()
    setCssCode(css)
    return css
  }

  const presetColors = ['#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff7700', '#ff33cc', '#33ccff', '#ff3366']

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Current setup</span>
        <strong>{fontSize}px text</strong>
        <p>{glowIntensity}px glow, {animation === 'none' ? 'static' : animation} animation.</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Export</span>
        <p>Generate CSS when you are happy with the preview, then copy it directly into your project.</p>
        {cssCode ? <CopyButton text={cssCode} /> : null}
      </div>
    </>
  )

  return (
    <ToolPage
      title="Neon Text Generator"
      subtitle="Create glowing headline treatments with adjustable color, size, animation, and font styling."
      description="This page now follows the same responsive control-and-preview structure as the rest of the tools while keeping the bold neon preview front and center."
      sidebar={sidebar}
    >
      <div className={styles.layout}>
        <section className={styles.panel}>
          <Field label="Text content">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} className={styles.input} placeholder="Type your neon text here" />
          </Field>

          <div className={styles.grid}>
            <div className={styles.controlBlock}>
              <label className={styles.label}>Font size</label>
              <RangeSlider min={24} max={120} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))} trackHeight={20} thumbSize={20} />
              <div className={styles.value}>{fontSize}px</div>
            </div>

            <div className={styles.controlBlock}>
              <label className={styles.label}>Glow intensity</label>
              <RangeSlider min={1} max={10} value={glowIntensity} onChange={(e) => setGlowIntensity(parseInt(e.target.value, 10))} trackHeight={20} thumbSize={20} />
              <div className={styles.value}>{glowIntensity}px</div>
            </div>
          </div>

          <div className={styles.controlBlock}>
            <label className={styles.label}>Neon color</label>
            <div className={styles.colorGrid}>
              {presetColors.map((preset) => (
                <button key={preset} className={styles.colorSwatch} style={{ backgroundColor: preset }} onClick={() => setColor(preset)} aria-label={`Select color ${preset}`} />
              ))}
            </div>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className={styles.colorPicker} />
          </div>

          <div className={styles.grid}>
            <div className={styles.controlBlock}>
              <label className={styles.label}>Font family</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className={styles.select}>
                <option value="'Arial', sans-serif">Arial</option>
                <option value="'Helvetica', sans-serif">Helvetica</option>
                <option value="'Verdana', sans-serif">Verdana</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Impact', sans-serif">Impact</option>
                <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
              </select>
            </div>

            <div className={styles.controlBlock}>
              <label className={styles.label}>Animation</label>
              <select value={animation} onChange={(e) => setAnimation(e.target.value)} className={styles.select}>
                <option value="none">None</option>
                <option value="pulse">Pulse</option>
                <option value="flicker">Flicker</option>
              </select>
            </div>
          </div>

          <Button onClick={generateCSS}>Generate CSS</Button>
        </section>

        <section className={styles.previewPanel}>
          <div className={styles.previewContainer}>
            <div
              ref={textRef}
              className={`${styles.neonText} ${animation !== 'none' ? styles[animation] : ''}`}
              style={{
                color,
                fontFamily,
                fontSize: `${fontSize}px`,
                textShadow: `
                  0 0 ${glowIntensity}px currentColor,
                  0 0 ${glowIntensity * 2}px currentColor,
                  0 0 ${glowIntensity * 4}px currentColor,
                  0 0 ${glowIntensity * 8}px currentColor
                  ${animation !== 'none' ? `,
                  0 0 ${glowIntensity * 12}px ${color},
                  0 0 ${glowIntensity * 16}px ${color}` : ''}
                `,
              }}
            >
              {text}
            </div>
          </div>

          {cssCode ? (
            <div className={styles.codeSection}>
              <div className={styles.codeHeader}>
                <h3>CSS code</h3>
                <CopyButton text={cssCode} />
              </div>
              <pre className={styles.codeBlock}>
                <code>{cssCode}</code>
              </pre>
            </div>
          ) : null}
        </section>
      </div>
    </ToolPage>
  )
}
