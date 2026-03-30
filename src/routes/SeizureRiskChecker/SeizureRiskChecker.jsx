import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './SeizureRiskChecker.module.css'
import { analyzeSeizureRisk, computeFlashPeriodHz } from './helpers'
import Button from '../../components/Common/Button/Button'
import ColorField from '../../components/Common/ColorField/ColorField'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

export default function SeizureRiskChecker() {
  const [frequency, setFrequency] = useState(12)
  const [duty, setDuty] = useState(50)
  const [area, setArea] = useState(30)
  const [duration, setDuration] = useState(3)
  const [color, setColor] = useState('#ff0000')
  const [previewEnabled, setPreviewEnabled] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState(null)
  const [previewActive, setPreviewActive] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const previewRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setPrefersReducedMotion(!!mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  const analyze = () => {
    const result = analyzeSeizureRisk({ frequency, duty, area, duration, color })
    setLastAnalysis(result)
    return result
  }

  const stopPreview = useCallback(() => {
    const node = previewRef.current
    if (!node) return
    node.classList.remove(styles.flashActive)
    node.style.animationDuration = ''
    setPreviewActive(false)
  }, [])

  const startPreview = useCallback((silent = false) => {
    if (!previewEnabled) {
      if (!silent) alert("Preview is disabled. Toggle 'Enable Preview' to allow previewing.")
      return
    }
    if (prefersReducedMotion) {
      if (!silent) alert('Your system prefers reduced motion, so preview is disabled to avoid triggers.')
      return
    }

    const node = previewRef.current
    if (!node) return

    const period = computeFlashPeriodHz(frequency)
    if (!period) {
      if (!silent) alert('Frequency is zero, so there is nothing to preview. Set a value above 0 Hz.')
      return
    }

    node.style.animationDuration = `${period}s`
    node.classList.remove(styles.flashActive)
    void node.offsetWidth
    node.classList.add(styles.flashActive)
    setPreviewActive(true)
  }, [frequency, prefersReducedMotion, previewEnabled])

  useEffect(() => {
    if (!previewEnabled || prefersReducedMotion || !frequency || frequency <= 0) {
      stopPreview()
      return undefined
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      startPreview(true)
      debounceRef.current = null
    }, 200)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
    }
  }, [frequency, duty, area, duration, color, previewEnabled, prefersReducedMotion, startPreview, stopPreview])

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    stopPreview()
  }, [stopPreview])

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Current pattern</span>
        <strong>{frequency} Hz</strong>
        <p>{duty}% duty cycle across {area}% of the area for {duration} seconds.</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Safety note</span>
        <p>This is a heuristic checker, not medical advice. Favor lower frequency, smaller area, and gentler color transitions when in doubt.</p>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Seizure Risk Checker"
      subtitle="Evaluate flashing patterns against common photosensitivity risk heuristics."
      description="The page now matches the rest of the tool suite with a consistent responsive layout, clearer controls, and a preview stage that behaves more safely on motion-sensitive systems."
      sidebar={sidebar}
      actions={
        <Button variant="ghost" size="sm" onClick={() => startPreview(false)} disabled={!previewEnabled}>
          Run preview
        </Button>
      }
    >
      <div className={styles.layout}>
        <section className={styles.panel}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="freq">Flash frequency: <span className={styles.value}>{frequency} Hz</span></label>
            <input id="freq" type="range" min="0" max="60" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className={styles.slider} />
            <div className={styles.hint}>Most risk sits roughly between 5 and 30 Hz. Staying at or below 3 Hz is more conservative.</div>
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="duty">Duty cycle: <span className={styles.value}>{duty}%</span></label>
              <input id="duty" type="range" min="1" max="100" value={duty} onChange={(e) => setDuty(Number(e.target.value))} className={styles.slider} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="area">Area affected: <span className={styles.value}>{area}%</span></label>
              <input id="area" type="range" min="1" max="100" value={area} onChange={(e) => setArea(Number(e.target.value))} className={styles.slider} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="duration">Duration: <span className={styles.value}>{duration}s</span></label>
            <input id="duration" type="range" min="0" max="30" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={styles.slider} />
          </div>

          <ColorField label="Flash color" color={color} hexValue={color} onColorChange={(e) => setColor(e.target.value)} onHexChange={(e) => setColor(e.target.value)} />

          <div className={styles.actions}>
            <Button onClick={analyze}>Analyze</Button>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={previewEnabled} onChange={(e) => setPreviewEnabled(e.target.checked)} aria-label="Enable preview" />
              <span>Enable preview</span>
            </label>
            <Button variant="ghost" onClick={stopPreview} disabled={!previewActive}>Stop preview</Button>
          </div>
        </section>

        <section className={styles.stage} aria-live="polite" aria-atomic="true">
          <div className={styles.previewContainer}>
            <div ref={previewRef} className={styles.sampleText} style={{ color, fontSize: '48px' }} role="img" aria-label={`Preview area showing text that may flash at ${frequency} hertz`}>
              FLASH
            </div>
          </div>

          <div className={styles.readout}>
            <div className={styles.readoutTitle}>Analysis</div>
            {lastAnalysis ? (
              <div className={styles.report}>
                <div className={styles.value}><strong>Risk:</strong> {lastAnalysis.level} ({lastAnalysis.score} / 100)</div>
                <ul>{lastAnalysis.reasons.map((reason, index) => <li key={index}>{reason}</li>)}</ul>
                <div className={styles.hint}><strong>Mitigations:</strong></div>
                <ul>{lastAnalysis.mitigation.map((item, index) => <li key={index}>{item}</li>)}</ul>
              </div>
            ) : (
              <div className={styles.hint}>Run analysis to see the risk summary and suggested mitigations.</div>
            )}
          </div>
        </section>
      </div>
    </ToolPage>
  )
}
