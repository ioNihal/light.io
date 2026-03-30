import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../contexts/ThemeProvider'
import styles from './ScreenLight.module.css'
import RangeSlider from '../../components/RangeSlider/RangeSlider'
import ToolPage from '../../components/Common/ToolPage/ToolPage'
import Button from '../../components/Common/Button/Button'

function ScreenLight() {
  const [screenLightOn, setScreenLightOn] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const { theme, toggle } = useTheme()
  const userTheme = useRef(theme)

  useEffect(() => {
    if (brightness <= 50 && theme === 'light') toggle()
    if (brightness > 50 && theme === 'dark') toggle()
  }, [brightness, theme, toggle])

  const bgColor = screenLightOn ? `hsl(0, 0%, ${brightness}%)` : 'var(--color-page-bg)'

  return (
    <ToolPage
      title="Screen Light"
      subtitle="Turn your display into a simple adjustable light source."
      description="Use this as a quick flashlight-style screen, a white-balance aid, or a brightness reference. Controls stay visible and usable across small and large screens."
      meta={
        <>
          <span className={styles.metaLabel}>Brightness</span>
          <strong className={styles.metaValue}>{screenLightOn ? `${brightness}%` : 'Off'}</strong>
        </>
      }
      actions={
        <Button variant="ghost" size="sm" onClick={() => {
          if (theme !== userTheme.current) toggle()
          setScreenLightOn((prev) => !prev)
        }}>
          {screenLightOn ? 'Turn off' : 'Turn on'}
        </Button>
      }
    >
      <div className={styles.layout}>
        <section className={styles.previewPanel}>
          <div className={styles.preview} style={{ backgroundColor: bgColor }}>
            <span className={styles.previewLabel}>{screenLightOn ? `Brightness ${brightness}%` : 'Light is off'}</span>
          </div>
        </section>

        <section className={styles.controls}>
          <Button onClick={() => setScreenLightOn((prev) => !prev)}>
            {screenLightOn ? 'Turn off screen light' : 'Turn on screen light'}
          </Button>
          <label className={styles.label}>
            Brightness
            <span>{brightness}%</span>
          </label>
          <RangeSlider
            min="0"
            max="100"
            value={brightness}
            disabled={!screenLightOn}
            onChange={(e) => setBrightness(Number(e.target.value))}
            label="brightness_slider"
            id="brightnessSlider"
            trackHeight={40}
            thumbSize={34}
          />
        </section>
      </div>
    </ToolPage>
  )
}

export default ScreenLight
