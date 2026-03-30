import { useNavigate } from 'react-router-dom'
import styles from './FlashClock.module.css'
import { useEffect, useRef, useState } from 'react'
import Button from '../../components/Common/Button/Button'
import NumberField from '../../components/Common/NumberField/NumberField'
import ToolPage from '../../components/Common/ToolPage/ToolPage'
import { CiBellOff, CiBellOn } from 'react-icons/ci'

function beep(audioCtx, duration = 200, frequency = 440, volume = 1) {
  try {
    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    gainNode.gain.value = volume
    oscillator.frequency.value = frequency
    oscillator.type = 'square'
    oscillator.start()

    setTimeout(() => {
      try {
        oscillator.stop()
        oscillator.disconnect()
        gainNode.disconnect()
      } catch {
        // oscillator may already be stopped
      }
    }, duration)
  } catch (error) {
    console.warn('beep error', error)
  }
}

export default function FlashClock() {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const [flashInterval, setFlashInterval] = useState(5)
  const [flashEnabled, setFlashEnabled] = useState(true)
  const [alarm, setAlarm] = useState(null)
  const [isAlarm, setIsAlarm] = useState(false)
  const [flashPulse, setFlashPulse] = useState(false)
  const [resetLabel, setResetLabel] = useState('Reset')

  const audioRef = useRef(null)
  const lastIntervalMinuteRef = useRef(null)
  const flashPulseTimeoutRef = useRef(null)
  const resetTimeoutRef = useRef(null)

  function ensureAudioCtx() {
    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioRef.current
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
      const now = new Date()
      const nowHHMM = now.toTimeString().slice(0, 5)

      if (isAlarm && alarm && nowHHMM === alarm) {
        beep(ensureAudioCtx(), 180, 880, 0.8)
        setFlashPulse(true)
        if (flashPulseTimeoutRef.current) clearTimeout(flashPulseTimeoutRef.current)
        flashPulseTimeoutRef.current = setTimeout(() => setFlashPulse(false), 400)
      }

      if (flashEnabled) {
        const minutes = now.getMinutes()
        const seconds = now.getSeconds()
        const every = Math.max(1, Number(flashInterval) || 1)

        if (seconds === 0 && minutes % every === 0 && lastIntervalMinuteRef.current !== minutes) {
          lastIntervalMinuteRef.current = minutes
          beep(ensureAudioCtx(), 220, 660, 0.9)
          setFlashPulse(true)
          if (flashPulseTimeoutRef.current) clearTimeout(flashPulseTimeoutRef.current)
          flashPulseTimeoutRef.current = setTimeout(() => setFlashPulse(false), 350)
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      if (flashPulseTimeoutRef.current) clearTimeout(flashPulseTimeoutRef.current)
    }
  }, [alarm, isAlarm, flashEnabled, flashInterval])

  const handleResetClick = () => {
    setFlashInterval(5)
    setFlashEnabled(false)
    setAlarm(null)
    setIsAlarm(false)

    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    setResetLabel('Reset!')
    resetTimeoutRef.current = setTimeout(() => {
      setResetLabel('Reset')
      resetTimeoutRef.current = null
    }, 2000)
  }

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Clock status</span>
        <strong>{flashEnabled ? `Flashing every ${flashInterval} min` : 'Flashing paused'}</strong>
        <p>{isAlarm && alarm ? `Alarm armed for ${alarm}` : 'No alarm armed'}</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Use cases</span>
        <ul className={styles.tipList}>
          <li>Study timers and focus reminders</li>
          <li>Visual alerts where audio should stay subtle</li>
          <li>Desk clocks with periodic attention nudges</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Flash Clock"
      subtitle="A digital clock with interval flash alerts and an optional time alarm."
      description="Designed as a lightweight visual alert tool: set a recurring flash interval, add a time alarm, and keep the controls accessible across desktop and mobile."
      sidebar={sidebar}
      actions={
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          Back To Tools
        </Button>
      }
    >
      <div className={styles.layout}>
        <section className={`${styles.clockCard} ${flashPulse ? styles.flash : ''}`}>
          <span className={styles.kicker}>Current time</span>
          <div className={styles.time}>{time}</div>
          <p className={styles.subtitle}>Visual interval reminders with optional alarm arming.</p>
        </section>

        <section className={styles.controls}>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Flash interval (minutes)</label>
              <NumberField value={flashInterval} onChange={(e) => setFlashInterval(Math.max(1, Number(e.target.value || 1)))} min={1} max={60} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Alarm time</label>
              <input type="time" defaultValue="08:30" onChange={(e) => setAlarm(e.target.value)} className={styles.timeInput} />
            </div>
          </div>

          <div className={styles.toggleRow}>
            <Button onClick={() => setFlashEnabled((prev) => !prev)}>
              {flashEnabled ? 'Pause flashes' : 'Start flashes'}
            </Button>

            <button className={styles.iconButton} onClick={() => setIsAlarm((prev) => !prev)} aria-label="Toggle alarm">
              {isAlarm ? <CiBellOn size={22} /> : <CiBellOff size={22} />}
              <span>{isAlarm ? 'Alarm on' : 'Alarm off'}</span>
            </button>

            <Button variant="ghost" onClick={handleResetClick}>{resetLabel}</Button>
          </div>
        </section>
      </div>
    </ToolPage>
  )
}
