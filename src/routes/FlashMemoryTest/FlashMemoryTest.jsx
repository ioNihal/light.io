import { useState } from 'react'
import styles from './FlashMemoryTest.module.css'
import Button from '../../components/Common/Button/Button'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

const COLORS = [
  { id: 0, name: 'Green', base: 'green', glow: 'greenGlow' },
  { id: 1, name: 'Red', base: 'red', glow: 'redGlow' },
  { id: 2, name: 'Yellow', base: 'yellow', glow: 'yellowGlow' },
  { id: 3, name: 'Blue', base: 'blue', glow: 'blueGlow' },
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function FlashMemoryTest() {
  const [sequence, setSequence] = useState([])
  const [userStep, setUserStep] = useState(0)
  const [level, setLevel] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [showing, setShowing] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [strict, setStrict] = useState(false)
  const [speed, setSpeed] = useState(650)
  const [message, setMessage] = useState('Press start to play!')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('flashGameHS') || '0', 10))

  const flashOnce = async (id, duration = 350) => {
    setActiveId(id)
    await sleep(duration)
    setActiveId(null)
  }

  const playBack = async (nextSequence) => {
    setShowing(true)
    await sleep(400)
    for (const id of nextSequence) {
      setActiveId(id)
      await sleep(speed)
      setActiveId(null)
      await sleep(Math.max(120, speed * 0.35))
    }
    setShowing(false)
  }

  const nextRound = async (previous = sequence) => {
    const nextId = Math.floor(Math.random() * 4)
    const nextSequence = [...previous, nextId]
    setSequence(nextSequence)
    setLevel((current) => current + 1)
    setUserStep(0)
    setSpeed((current) => Math.max(250, Math.floor(current * 0.95)))

    await playBack(nextSequence)
    setMessage('Your turn!')
  }

  const startGame = async () => {
    setPlaying(true)
    setMessage('Watch the sequence carefully!')
    setSequence([])
    setUserStep(0)
    setLevel(0)
    setScore(0)
    setSpeed(650)
    await nextRound([])
  }

  const handleInput = async (id) => {
    if (!playing || showing) return
    await flashOnce(id, Math.max(200, speed * 0.6))

    if (id !== sequence[userStep]) {
      if (strict) {
        setMessage('Wrong! Game over.')
        setPlaying(false)
        setHighScore((current) => {
          const nextHigh = Math.max(current, score)
          localStorage.setItem('flashGameHS', String(nextHigh))
          return nextHigh
        })
      } else {
        setMessage('Oops. Watch again...')
        setUserStep(0)
        await playBack(sequence)
        setMessage('Your turn now!')
      }
      return
    }

    const nextStep = userStep + 1
    setUserStep(nextStep)

    if (nextStep === sequence.length) {
      const nextScore = score + 10 + Math.max(0, 10 - Math.floor(sequence.length / 2))
      setScore(nextScore)
      setHighScore((current) => {
        const nextHigh = Math.max(current, nextScore)
        localStorage.setItem('flashGameHS', String(nextHigh))
        return nextHigh
      })
      setMessage('Nice! Next round...')
      await sleep(550)
      await nextRound()
    }
  }

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Stats</span>
        <strong>Level {level || 0}</strong>
        <p>Score {score}, high score {highScore}</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Mode</span>
        <label className={styles.strict}>
          <input type="checkbox" checked={strict} onChange={(e) => setStrict(e.target.checked)} />
          <span>Strict mode</span>
        </label>
        <p>Strict mode ends the run immediately after a wrong tap.</p>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Flash Memory Test"
      subtitle="Repeat the growing color sequence and push your short-term memory."
      description="This version keeps the board centered, the status visible, and the controls touch-friendly across phone, tablet, and desktop breakpoints."
      sidebar={sidebar}
    >
      <div className={styles.layout}>
        <section className={styles.board}>
          <div className={styles.grid}>
            {COLORS.map((color) => {
              const isActive = activeId === color.id
              return (
                <button
                  key={color.id}
                  onClick={() => handleInput(color.id)}
                  disabled={!playing || showing}
                  aria-label={color.name}
                  className={`${styles.tile} ${styles[color.base]} ${isActive ? styles[color.glow] : ''}`}
                />
              )
            })}
          </div>
        </section>

        <section className={styles.controls}>
          <Button onClick={startGame} disabled={showing}>
            {playing ? 'Restart game' : 'Start game'}
          </Button>
          <div className={styles.message} aria-live="polite" aria-atomic="true">
            {message}
          </div>
        </section>
      </div>
    </ToolPage>
  )
}
