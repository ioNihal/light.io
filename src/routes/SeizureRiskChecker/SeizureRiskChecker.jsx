// SeizureRiskChecker.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "./SeizureRiskChecker.module.css";
import { analyzeSeizureRisk, computeFlashPeriodHz } from "./helpers";

export default function SeizureRiskChecker() {
  const [frequency, setFrequency] = useState(12); // Hz
  const [duty, setDuty] = useState(50); // % on-time
  const [area, setArea] = useState(30); // % of screen area affected
  const [duration, setDuration] = useState(3); // seconds
  const [color, setColor] = useState("#ff0000");
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);

  const previewRef = useRef(null);
  const debounceRef = useRef(null);
  const [previewActive, setPreviewActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect reduced-motion preference (client-side)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPrefersReducedMotion(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Run analysis by delegating to helper
  const analyze = () => {
    const result = analyzeSeizureRisk({ frequency, duty, area, duration, color });
    setLastAnalysis(result);
    return result;
  };

  // internal: start preview (silent flag avoids alerts when auto-running)
  const startPreview = (silent = false) => {
    if (!previewEnabled) {
      if (!silent) {
        alert("Preview is disabled. Toggle 'Enable Preview' to allow previewing.");
      }
      return;
    }
    if (prefersReducedMotion) {
      if (!silent) alert("Your system prefers reduced motion — preview disabled to avoid triggers.");
      return;
    }

    const node = previewRef.current;
    if (!node) return;

    // frequency -> period
    const period = computeFlashPeriodHz(frequency);
    if (!period) {
      if (!silent) alert("Frequency is zero — nothing to preview. Set a frequency > 0 Hz.");
      return;
    }

    // Set CSS animation duration to period (1 cycle). CSS keyframes will handle the on/off visual.
    node.style.animationDuration = `${period}s`;

    // Restart animation by toggling the class
    node.classList.remove(styles.flashActive);
    // force reflow
    void node.offsetWidth;
    node.classList.add(styles.flashActive);
    setPreviewActive(true);
  };

  const stopPreview = () => {
    const node = previewRef.current;
    if (!node) return;
    node.classList.remove(styles.flashActive);
    node.style.animationDuration = "";
    setPreviewActive(false);
  };

  // Manual Run Preview button (shows alerts if preview disabled)
  const onRunPreview = () => {
    startPreview(false);
  };

  // Auto-rerun preview when key values change (debounced). Only runs when previewEnabled is true.
  useEffect(() => {
    // if preview not enabled, ensure preview stopped
    if (!previewEnabled) {
      stopPreview();
      return;
    }

    // if system prefers reduced motion, do not auto-run
    if (prefersReducedMotion) {
      stopPreview();
      return;
    }

    // only auto-run if frequency > 0 (meaningful flash)
    if (!frequency || frequency <= 0) {
      stopPreview();
      return;
    }

    // debounce changes to avoid rapid restarts when dragging sliders
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startPreview(true); // silent auto-run
      debounceRef.current = null;
    }, 200); // 200ms debounce - adjust if you want snappier or smoother

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequency, duty, area, duration, color, previewEnabled, prefersReducedMotion]);

  // cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      stopPreview();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Seizure Risk Checker</h1>
          <p className={styles.subtitle}>
            Analyze flashing patterns for photosensitive seizure risk. This is a heuristic tool — not a medical device.
          </p>
        </header>

        <div className={styles.mainSection}>
          <aside className={styles.controls} aria-label="Controls">
            <div className={styles.field}>
              <label className={styles.label} htmlFor="freq">
                Flash frequency (Hz): <span className={styles.value}>{frequency}</span>
              </label>
              <input
                id="freq"
                type="range"
                min="0"
                max="60"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className={styles.slider}
                aria-valuemin={0}
                aria-valuemax={60}
                aria-valuenow={frequency}
              />
              <div className={styles.hint}>Most risk between ~5–30 Hz; keep ≤3 Hz to be conservative.</div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="duty">
                  Duty cycle (% on): <span className={styles.value}>{duty}%</span>
                </label>
                <input
                  id="duty"
                  type="range"
                  min="1"
                  max="100"
                  value={duty}
                  onChange={(e) => setDuty(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="area">
                  Area affected (%): <span className={styles.value}>{area}%</span>
                </label>
                <input
                  id="area"
                  type="range"
                  min="1"
                  max="100"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="duration">
                Duration (seconds): <span className={styles.value}>{duration}s</span>
              </label>
              <input
                id="duration"
                type="range"
                min="0"
                max="30"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="color">Flash color</label>
              <input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={styles.colorPicker}
              />
              <div className={styles.hint}>Saturated red is more likely to provoke sensitivity; favor gentle fades.</div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btn} onClick={analyze}>Analyze</button>

              <label className={styles.checkRow} style={{ alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={previewEnabled}
                  onChange={(e) => setPreviewEnabled(e.target.checked)}
                  aria-label="Enable preview"
                />{" "}
                Enable Preview
              </label>

              <button
                className={styles.btnGhost}
                onClick={onRunPreview}
                aria-pressed={previewActive}
                title="Run preview now"
              >
                Run Preview
              </button>

              <button
                className={styles.btnGhost}
                onClick={stopPreview}
                disabled={!previewActive}
                title="Stop preview"
                style={{ opacity: previewActive ? 1 : 0.6 }}
              >
                Stop Preview
              </button>
            </div>
          </aside>

          <section className={styles.stage} aria-live="polite" aria-atomic="true">
            <div className={styles.previewContainer}>
              <div
                ref={previewRef}
                id="previewText"
                className={styles.sampleText}
                style={{
                  color,
                  fontSize: "48px",
                }}
                role="img"
                aria-label={`Preview area showing text that may flash at ${frequency} hertz`}
              >
                FLASH
              </div>
            </div>

            <div className={styles.readout}>
              <div className={styles.readoutTitle}>Analysis</div>

              {lastAnalysis ? (
                <div className={styles.code}>
                  <div className={styles.value}>
                    <strong>Risk:</strong> {lastAnalysis.level} ({lastAnalysis.score} / 100)
                  </div>

                  <ul>
                    {lastAnalysis.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>

                  <div className={styles.hint}><strong>Mitigations:</strong></div>
                  <ul>
                    {lastAnalysis.mitigation.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              ) : (
                <div className={styles.hint}>Run analysis to see results and recommendations.</div>
              )}
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <div className={styles.small}>
            Important: This checker uses published heuristics about photosensitivity. It is not a substitute for clinical advice. If you or your users are sensitive, avoid flashing content and consult healthcare professionals.
          </div>
        </footer>
      </div>
    </div>
  );
}
