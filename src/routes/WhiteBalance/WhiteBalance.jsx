import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './WhiteBalance.module.css';
import {
  computeGainsFromTempAndTint,
  applyGainsToImageData,
  estimateTempAndTintFromCanvas,
  drawImageToCanvas,
} from './helpers';

export default function WhiteBalance() {
  const canvasRef = useRef(null);
  const imgRef = useRef(new Image());
  const previewRef = useRef(null);
  const containerRef = useRef(null);

  const [fileUrl, setFileUrl] = useState(null);
  const [temperature, setTemperature] = useState(6500); // 2000 - 10000 K
  const [tint, setTint] = useState(0); // -100 .. +100
  const [strength, setStrength] = useState(1); // 0..1
  const [showOriginal, setShowOriginal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // mobile controls toggle (visible on small screens)
  const [controlsOpen, setControlsOpen] = useState(true);

  // Apply white balance on the pixel data in the canvas
  const applyWhiteBalanceToCanvas = useCallback(
    (tempK, tintValue, blend = 1) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setProcessing(true);

      requestAnimationFrame(() => {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        try {
          const imgData = ctx.getImageData(0, 0, width, height);
          const gains = computeGainsFromTempAndTint(tempK, tintValue);
          applyGainsToImageData(imgData, gains, blend);
          ctx.putImageData(imgData, 0, 0);
        } catch (err) {
          // reading ImageData can throw if canvas is tainted — ignore gracefully
          // (user should ensure crossOrigin or use local file)
          console.warn('Could not read canvas pixel data', err);
        }
        setProcessing(false);
      });
    },
    []
  );

  // Handle file upload
  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFileUrl(url);
    imgRef.current = new Image();
    imgRef.current.crossOrigin = 'anonymous';
    imgRef.current.onload = () => {
      // draw to fit preview width
      resizeAndDraw(imgRef.current);
    };
    imgRef.current.src = url;
  }

  // Draw image with sizes based on preview container width/height
  function resizeAndDraw(img = imgRef.current) {
    const canvas = canvasRef.current;
    const preview = previewRef.current;
    if (!canvas || !img || !preview) return;

    // compute a sensible max width/height based on preview area
    const style = getComputedStyle(preview);
    const paddingX = parseFloat(style.paddingLeft || 0) + parseFloat(style.paddingRight || 0);
    const maxW = Math.max(200, Math.floor(preview.clientWidth - paddingX));
    const maxH = Math.max(160, 900); // keep tall limit if needed

    drawImageToCanvas(canvas, img, { maxW, maxH });
    if (!showOriginal) {
      applyWhiteBalanceToCanvas(temperature, tint, strength);
    }
  }

  // Re-apply when temp/tint/strength change
  useEffect(() => {
    if (!canvasRef.current) return;
    if (fileUrl && imgRef.current?.complete) {
      resizeAndDraw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temperature, tint, strength, fileUrl]);

  // ResizeObserver to react to layout changes / orientation changes
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const ro = new ResizeObserver(() => {
      // redraw to best fit the preview area
      resizeAndDraw();
    });
    ro.observe(preview);

    // also re-evaluate controlsOpen for initial layout (desktop -> show)
    if (window.innerWidth >= 1024) setControlsOpen(true);

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto white balance (simple heuristic)
  function autoWhiteBalance() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // ensure original pixels are drawn
    drawImageToCanvas(canvas, imgRef.current);
    const { temp: suggestedTemp, tint: suggestedTint } = estimateTempAndTintFromCanvas(canvas);
    setTemperature(suggestedTemp);
    setTint(suggestedTint);
  }

  function downloadCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'white-balanced.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  const presets = [
    { name: 'Tungsten (3200K)', temp: 3200, tint: 0 },
    { name: 'Fluorescent (4000K)', temp: 4000, tint: 0 },
    { name: 'Daylight (5600K)', temp: 5600, tint: 0 },
    { name: 'Cloudy (7000K)', temp: 7000, tint: 0 },
    { name: 'Shade (8000K)', temp: 8000, tint: 0 },
  ];

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.header}>White Balance Visualizer</h2>
          <p className={styles.subtitle}>Simulate camera white balance filters on your image.</p>
        </div>

        {/* mobile toggle: visible only on small screens via CSS */}
        <button
          type="button"
          className={styles.mobileToggle}
          onClick={() => setControlsOpen((s) => !s)}
          aria-expanded={controlsOpen}
        >
          {controlsOpen ? 'Hide controls' : 'Show controls'}
        </button>
      </div>

      <div className={styles.layout}>
        <div className={`${styles.controls} ${!controlsOpen ? styles.collapsed : ''}`}>
          <label className={styles.label}>Upload image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className={styles.fileInput}
          />

          <div className={styles.field}>
            <label className={styles.label}>Temperature (Kelvin):</label>
            <div className={styles.rangeRow}>
              <input
                type="range"
                min={2000}
                max={10000}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className={styles.range}
              />
              <div className={styles.rangeValue}>{temperature}K</div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tint:</label>
            <div className={styles.rangeRow}>
              <input
                type="range"
                min={-100}
                max={100}
                value={tint}
                onChange={(e) => setTint(Number(e.target.value))}
                className={styles.range}
              />
              <div className={styles.rangeValue}>{tint}</div>
            </div>
            <div className={styles.hint}>Negative → greener · Positive → magenta</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Strength:</label>
            <div className={styles.rangeRow}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className={styles.range}
              />
              <div className={styles.rangeValue}>{Math.round(strength * 100)}%</div>
            </div>
          </div>

          <div className={styles.presets}>
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setTemperature(p.temp);
                  setTint(p.tint);
                }}
                className={styles.presetBtn}
                type="button"
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className={styles.btnRow}>
            <button
              type="button"
              onClick={() => {
                if (!imgRef.current) return;
                drawImageToCanvas(canvasRef.current, imgRef.current);
                autoWhiteBalance();
              }}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Auto WB
            </button>

            <button
              type="button"
              onClick={() => {
                if (!fileUrl || !imgRef.current) return;
                drawImageToCanvas(canvasRef.current, imgRef.current);
                applyWhiteBalanceToCanvas(temperature, tint, strength);
              }}
              className={styles.btn}
            >
              Apply
            </button>

            <button type="button" onClick={downloadCanvas} className={styles.btn}>
              Download
            </button>
          </div>

          <div className={styles.tip}>
            Tip: upload a photo, try presets, then tweak Temperature and Tint for the look you want.
          </div>
        </div>

        <div className={styles.preview} ref={previewRef}>
          <div className={styles.previewHeader}>
            <div className={styles.smallMuted}>Preview</div>
            <div>
              <label className={styles.smallMutedInline}>
                <input
                  type="checkbox"
                  checked={showOriginal}
                  onChange={(e) => {
                    setShowOriginal(e.target.checked);
                    // redraw original or processed immediately
                    if (e.target.checked) drawImageToCanvas(canvasRef.current, imgRef.current);
                    else applyWhiteBalanceToCanvas(temperature, tint, strength);
                  }}
                />
                <span className={styles.showOriginalText}>Show original</span>
              </label>
            </div>
          </div>

          <div className={styles.previewCard}>
            {!fileUrl ? (
              <div className={styles.smallMuted}>No image selected — upload to preview.</div>
            ) : (
              <div className={styles.canvasWrapper}>
                <canvas ref={canvasRef} className={styles.canvasEl} />
                <div className={styles.status}>{processing ? 'Processing...' : 'Ready'}</div>
              </div>
            )}
          </div>

          <div className={styles.smallMuted} style={{ marginTop: 12 }}>
            You can also drag the file into the browser's file input or replace the canvas image by uploading another file.
          </div>
        </div>
      </div>

      <EffectForOriginalToggle
        showOriginal={showOriginal}
        fileUrl={fileUrl}
        imgRef={imgRef}
        canvasRef={canvasRef}
        temperature={temperature}
        tint={tint}
        strength={strength}
        applyWhiteBalanceToCanvas={applyWhiteBalanceToCanvas}
      />
    </div>
  );
}

function EffectForOriginalToggle({
  showOriginal,
  fileUrl,
  imgRef,
  canvasRef,
  temperature,
  tint,
  strength,
  applyWhiteBalanceToCanvas,
}) {
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    if (!fileUrl || !imgRef.current) return;

    if (showOriginal) {
      drawImageToCanvas(canvas, imgRef.current);
    } else {
      applyWhiteBalanceToCanvas(temperature, tint, strength);
    }
  }, [showOriginal, fileUrl, imgRef, canvasRef, temperature, tint, strength, applyWhiteBalanceToCanvas]);

  return null;
}
