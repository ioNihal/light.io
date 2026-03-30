import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './MorseCode.module.css'
import { buildTimelineFromText, MORSE_MAP, unitMsFromWPM } from './helpers'
import RangeSlider from '../../components/RangeSlider/RangeSlider'
import Button from '../../components/Common/Button/Button'
import ColorField from '../../components/Common/ColorField/ColorField'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

export default function MorseCode() {
  const [text, setText] = useState('SOS HELP')
  const [wpm, setWpm] = useState(20)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [flashColor, setFlashColor] = useState('#00ff88')
  const [bgColor, setBgColor] = useState('#0b0f14')
  const [showBeep, setShowBeep] = useState(false)
  const [freq, setFreq] = useState(600)
  const [volume, setVolume] = useState(0.1)

  const timeline = useMemo(() => buildTimelineFromText(text), [text])
  const unitMs = useMemo(() => unitMsFromWPM(wpm), [wpm])

  const cancelRef = useRef({ cancelled: false })
  const audioRef = useRef()
  const gainRef = useRef()
  const oscRef = useRef()
  const runningRef = useRef(false)

  useEffect(() => () => stopAudio(), [])

  function startAudio() {
    if (!showBeep) return
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)()
      const ctx = audioRef.current
      stopAudio()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      gain.gain.value = 0
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.connect(gain).connect(ctx.destination)
      osc.start()

      gainRef.current = gain
      oscRef.current = osc
    } catch (error) {
      console.error(error.message)
    }
  }

  function stopAudio() {
    try {
      oscRef.current?.stop()
      oscRef.current?.disconnect()
      gainRef.current?.disconnect()
    } catch (error) {
      console.error(error.message)
    } finally {
      oscRef.current = undefined
      gainRef.current = undefined
    }
  }

  function setTone(on) {
    if (!showBeep || !gainRef.current || !audioRef.current) return
    const now = audioRef.current.currentTime
    const target = on ? Math.max(0, Math.min(1, volume)) : 0
    gainRef.current.gain.cancelScheduledValues(now)
    gainRef.current.gain.linearRampToValueAtTime(target, now + 0.01)
  }

  async function playOnce() {
    if (!timeline.length) return
    cancelRef.current.cancelled = false
    runningRef.current = true
    if (showBeep) startAudio()

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    for (let i = 0; i < timeline.length; i += 1) {
      if (cancelRef.current.cancelled) break
      const { on, units } = timeline[i]
      setFlashOn(prefersReduced ? false : on)
      setTone(on)
      await new Promise((resolve) => setTimeout(resolve, units * unitMs))
    }

    setFlashOn(false)
    setTone(false)
    stopAudio()
    runningRef.current = false
  }

  async function handlePlay() {
    if (runningRef.current) return
    setIsPlaying(true)
    do {
      await playOnce()
      if (cancelRef.current.cancelled) break
    } while (loop)
    setIsPlaying(false)
  }

  function handlePause() {
    cancelRef.current.cancelled = true
    setIsPlaying(false)
    setFlashOn(false)
    setTone(false)
    stopAudio()
    runningRef.current = false
  }

  useEffect(() => {
    if (oscRef.current) {
      try {
        oscRef.current.frequency.value = freq
      } catch {
        // ignore oscillator updates after teardown
      }
    }
  }, [freq])

  useEffect(() => {
    if (gainRef.current && audioRef.current) {
      const now = audioRef.current.currentTime
      gainRef.current.gain.cancelScheduledValues(now)
      gainRef.current.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, isPlaying && showBeep && flashOn ? volume : 0)), now + 0.01)
    }
  }, [volume, showBeep, isPlaying, flashOn])

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Playback</span>
        <strong>{wpm} WPM</strong>
        <p>{unitMs.toFixed(0)} ms per timing unit with {timeline.length} timeline steps.</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Options</span>
        <label className={styles.checkRow}>
          <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
          <span>Loop playback</span>
        </label>
        <label className={styles.checkRow}>
          <input type="checkbox" checked={showBeep} onChange={(e) => setShowBeep(e.target.checked)} />
          <span>Enable tone</span>
        </label>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Morse Code Flasher"
      subtitle="Turn plain text into timed Morse flashes with optional audio feedback."
      description="The controls, preview stage, and encoded readout now follow the same responsive layout as the rest of the tool suite while preserving the existing flashing logic."
      sidebar={sidebar}
    >
      <div className={styles.layout}>
        <section className={styles.panel}>
          <label className={styles.field}>
            <span className={styles.label}>Message</span>
            <textarea className={styles.input} rows={3} placeholder="Type message..." value={text} onChange={(e) => setText(e.target.value)} />
            <div className={styles.hint}>Unsupported characters are ignored. Spaces create word gaps.</div>
          </label>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Speed</span>
              <RangeSlider min={5} max={40} step={1} value={wpm} onChange={(e) => setWpm(parseInt(e.target.value, 10))} />
              <div className={styles.value}>{wpm} WPM</div>
            </label>

            <div className={styles.metricCard}>
              <span className={styles.label}>Unit duration</span>
              <strong>{unitMs.toFixed(0)} ms</strong>
            </div>
          </div>

          <div className={styles.grid}>
            <ColorField label="Flash color" color={flashColor} hexValue={flashColor} onColorChange={(e) => setFlashColor(e.target.value)} onHexChange={(e) => setFlashColor(e.target.value)} />
            <ColorField label="Background" color={bgColor} hexValue={bgColor} onColorChange={(e) => setBgColor(e.target.value)} onHexChange={(e) => setBgColor(e.target.value)} />
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span className={styles.label}>Frequency</span>
              <RangeSlider min={300} max={1200} step={10} value={freq} onChange={(e) => setFreq(parseInt(e.target.value, 10))} />
              <div className={styles.value}>{freq} Hz</div>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Volume</span>
              <RangeSlider min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
              <div className={styles.value}>{Math.round(volume * 100)}%</div>
            </label>
          </div>

          <div className={styles.actions}>
            <Button onClick={isPlaying ? handlePause : handlePlay}>{isPlaying ? 'Pause' : 'Play'}</Button>
            <Button variant="ghost" onClick={handlePause}>Stop</Button>
          </div>
        </section>

        <section className={styles.stage} style={{ backgroundColor: bgColor }}>
          <div className={styles.flash} style={{ opacity: flashOn ? 1 : 0.12, backgroundColor: flashColor, boxShadow: flashOn ? `0 0 24px ${flashColor}` : 'none' }} />
        </section>

        <section className={styles.readout}>
          <div className={styles.readoutTitle}>Encoded preview</div>
          <div className={styles.code}>
            {text.split('').map((character, index) => {
              if (character === ' ') return <span key={index} className={styles.wordGap}> / </span>
              const code = MORSE_MAP[character.toUpperCase()]
              if (!code) return <span key={index} className={styles.ignored}>{character}</span>
              return (
                <span key={index} className={styles.letter}>
                  <span className={styles.letterChar}>{character}</span>
                  <span className={styles.letterCode}>{code}</span>
                </span>
              )
            })}
          </div>
        </section>
      </div>
    </ToolPage>
  )
}
