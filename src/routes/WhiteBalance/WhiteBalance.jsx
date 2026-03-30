import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './WhiteBalance.module.css'
import {
  computeGainsFromTempAndTint,
  applyGainsToImageData,
  estimateTempAndTintFromCanvas,
  drawImageToCanvas,
} from './helpers'
import ToolPage from '../../components/Common/ToolPage/ToolPage'
import Button from '../../components/Common/Button/Button'

export default function WhiteBalance() {
  const canvasRef = useRef(null)
  const imgRef = useRef(new Image())
  const previewRef = useRef(null)
  const fileInputRef = useRef(null)

  const [fileUrl, setFileUrl] = useState(null)
  const [temperature, setTemperature] = useState(6500)
  const [tint, setTint] = useState(0)
  const [strength, setStrength] = useState(1)
  const [showOriginal, setShowOriginal] = useState(false)
  const [processing, setProcessing] = useState(false)

  const applyWhiteBalanceToCanvas = useCallback((tempK, tintValue, blend = 1) => {
    const canvas = canvasRef.current
    if (!canvas) return

    setProcessing(true)
    requestAnimationFrame(() => {
      const ctx = canvas.getContext('2d')
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const gains = computeGainsFromTempAndTint(tempK, tintValue)
        applyGainsToImageData(imageData, gains, blend)
        ctx.putImageData(imageData, 0, 0)
      } catch (error) {
        console.warn('Could not read canvas pixel data', error)
      }
      setProcessing(false)
    })
  }, [])

  const resizeAndDraw = useCallback((img = imgRef.current) => {
    const canvas = canvasRef.current
    const preview = previewRef.current
    if (!canvas || !img || !preview) return

    const maxW = Math.max(260, Math.floor(preview.clientWidth - 32))
    const maxH = Math.max(220, Math.floor(window.innerHeight * 0.62))
    drawImageToCanvas(canvas, img, { maxW, maxH })
    if (!showOriginal) applyWhiteBalanceToCanvas(temperature, tint, strength)
  }, [applyWhiteBalanceToCanvas, showOriginal, temperature, tint, strength])

  const handleFile = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setFileUrl(url)
    imgRef.current = new Image()
    imgRef.current.crossOrigin = 'anonymous'
    imgRef.current.onload = () => resizeAndDraw(imgRef.current)
    imgRef.current.src = url
  }

  useEffect(() => {
    if (fileUrl && imgRef.current?.complete) resizeAndDraw()
  }, [temperature, tint, strength, fileUrl, resizeAndDraw])

  useEffect(() => {
    const preview = previewRef.current
    if (!preview) return undefined
    const observer = new ResizeObserver(() => resizeAndDraw())
    observer.observe(preview)
    return () => observer.disconnect()
  }, [resizeAndDraw])

  useEffect(() => () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl)
  }, [fileUrl])

  const autoWhiteBalance = () => {
    const canvas = canvasRef.current
    if (!canvas || !imgRef.current) return
    drawImageToCanvas(canvas, imgRef.current)
    const { temp: suggestedTemp, tint: suggestedTint } = estimateTempAndTintFromCanvas(canvas)
    setTemperature(suggestedTemp)
    setTint(suggestedTint)
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'white-balanced.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const presets = [
    { name: 'Tungsten', temp: 3200, tint: 0 },
    { name: 'Fluorescent', temp: 4000, tint: 0 },
    { name: 'Daylight', temp: 5600, tint: 0 },
    { name: 'Cloudy', temp: 7000, tint: 0 },
    { name: 'Shade', temp: 8000, tint: 0 },
  ]

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Current settings</span>
        <strong>{temperature}K</strong>
        <p>Tint {tint >= 0 ? `+${tint}` : tint}, strength {Math.round(strength * 100)}%</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Suggested flow</span>
        <ul className={styles.tipList}>
          <li>Start with a preset that matches the lighting source.</li>
          <li>Use Auto WB for a fast baseline, then fine tune manually.</li>
          <li>Toggle the original on and off to check skin tones and neutrals.</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="White Balance Visualizer"
      subtitle="Simulate camera white balance adjustments directly on an uploaded image."
      description="Upload a photo, test common lighting presets, and fine tune temperature, tint, and effect strength before exporting a corrected preview."
      sidebar={sidebar}
      actions={
        <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
          {fileUrl ? 'Replace image' : 'Upload image'}
        </Button>
      }
    >
      <div className={styles.layout}>
        <section className={styles.controls}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <div className={styles.sliderGroup}>
            <label className={styles.label}>
              Temperature
              <span>{temperature}K</span>
            </label>
            <input type="range" min={2000} max={10000} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.label}>
              Tint
              <span>{tint}</span>
            </label>
            <input type="range" min={-100} max={100} value={tint} onChange={(e) => setTint(Number(e.target.value))} />
          </div>

          <div className={styles.sliderGroup}>
            <label className={styles.label}>
              Strength
              <span>{Math.round(strength * 100)}%</span>
            </label>
            <input type="range" min={0} max={1} step={0.01} value={strength} onChange={(e) => setStrength(Number(e.target.value))} />
          </div>

          <div className={styles.presets}>
            {presets.map((preset) => (
              <button
                key={preset.name}
                className={styles.preset}
                onClick={() => {
                  setTemperature(preset.temp)
                  setTint(preset.tint)
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className={styles.actionsRow}>
            <Button onClick={autoWhiteBalance} disabled={!fileUrl}>Auto WB</Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (!fileUrl || !imgRef.current) return
                drawImageToCanvas(canvasRef.current, imgRef.current)
                applyWhiteBalanceToCanvas(temperature, tint, strength)
              }}
              disabled={!fileUrl}
            >
              Reapply
            </Button>
            <Button variant="ghost" onClick={downloadCanvas} disabled={!fileUrl}>Download</Button>
          </div>
        </section>

        <section className={styles.preview} ref={previewRef}>
          <div className={styles.previewHeader}>
            <span className={styles.previewLabel}>Preview</span>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={showOriginal}
                onChange={(e) => {
                  const nextValue = e.target.checked
                  setShowOriginal(nextValue)
                  if (nextValue) drawImageToCanvas(canvasRef.current, imgRef.current)
                  else applyWhiteBalanceToCanvas(temperature, tint, strength)
                }}
                disabled={!fileUrl}
              />
              <span>Show original</span>
            </label>
          </div>

          <div className={styles.previewCard}>
            {!fileUrl ? (
              <div className={styles.placeholder}>Upload an image to start previewing.</div>
            ) : (
              <div className={styles.canvasWrap}>
                <canvas ref={canvasRef} className={styles.canvas} />
                <div className={styles.status}>{processing ? 'Processing image...' : 'Ready to export'}</div>
              </div>
            )}
          </div>
        </section>
      </div>
    </ToolPage>
  )
}
