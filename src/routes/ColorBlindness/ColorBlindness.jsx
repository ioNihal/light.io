import { useEffect, useRef, useState } from 'react'
import styles from './ColorBlindness.module.css'
import { applyColorBlindness } from './filters'
import Button from '../../components/Common/Button/Button'
import ToolPage from '../../components/Common/ToolPage/ToolPage'

const OPTIONS = [
  { value: 'none', label: 'Normal vision' },
  { value: 'protanopia', label: 'Protanopia' },
  { value: 'deuteranopia', label: 'Deuteranopia' },
  { value: 'tritanopia', label: 'Tritanopia' },
  { value: 'achromatopsia', label: 'Achromatopsia' },
]

export default function ColorBlindness() {
  const [imgSrc, setImgSrc] = useState(null)
  const [mode, setMode] = useState('none')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImgSrc(reader.result)
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!imgSrc || mode === 'none') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imgSrc

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      applyColorBlindness(ctx, img.width, img.height, mode)
      canvas.style.width = '100%'
      canvas.style.height = 'auto'
    }

    img.onerror = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [imgSrc, mode])

  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Current simulation</span>
        <strong>{OPTIONS.find((item) => item.value === mode)?.label}</strong>
        <p>Upload a screenshot, switch the vision model, and compare your original and simulated preview.</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Workflow tip</span>
        <ul className={styles.tipList}>
          <li>Use small or medium images for faster CPU-side processing.</li>
          <li>Test charts, buttons, and alert states to spot weak color reliance.</li>
          <li>Compare contrast after simulation for the most realistic audit.</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Color Blindness Simulator"
      subtitle="Preview how an uploaded image appears under common color-vision deficiencies."
      description="This tool runs in the browser, so larger files can take longer to process. It is especially useful for checking illustrations, dashboards, status colors, and UI screenshots."
      sidebar={sidebar}
      actions={
        imgSrc ? (
          <Button variant="ghost" size="sm" onClick={() => setImgSrc(null)}>
            Clear image
          </Button>
        ) : null
      }
    >
      <div className={styles.layout}>
        <section className={styles.panel}>
          <div
            className={[styles.dropzone, isDragging ? styles.dragging : ''].join(' ')}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setIsDragging(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFile(e.dataTransfer.files?.[0])
            }}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
            }}
          >
            {imgSrc ? (
              <>
                <img src={imgSrc} alt="Uploaded preview" className={styles.thumb} />
                <div className={styles.dropActions}>
                  <Button onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}>
                    Change file
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      setImgSrc(null)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span className={styles.dropEyebrow}>Drop an image</span>
                <strong className={styles.dropTitle}>Drag a screenshot here or browse your files</strong>
                <p className={styles.dropCopy}>PNG and JPG work best for quick previews.</p>
                <Button>Browse files</Button>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <div className={styles.modePicker}>
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                className={[styles.modeButton, mode === option.value ? styles.modeButtonActive : ''].join(' ')}
                onClick={() => setMode(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.previewCard}>
          {!imgSrc ? (
            <div className={styles.placeholder}>Upload an image to start previewing.</div>
          ) : mode === 'none' ? (
            <img src={imgSrc} alt="Original preview" className={styles.previewMedia} />
          ) : (
            <canvas ref={canvasRef} className={styles.previewMedia} />
          )}
        </section>
      </div>
    </ToolPage>
  )
}
