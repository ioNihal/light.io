import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './MorseCode.module.css';
import { buildTimelineFromText, MORSE_MAP, unitMsFromWPM } from './helpers';
import { useNavigate } from 'react-router-dom';
import RangeSlider from '../../components/RangeSlider/RangeSlider';


export default function MorseCode() {
    const [text, setText] = useState("SOS HELP");
    const [wpm, setWpm] = useState(20);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loop, setLoop] = useState(false);
    const [flashOn, setFlashON] = useState(false);
    const [flashColor, setFlashColor] = useState("#00ff88");
    const [bgColor, setBgColor] = useState("#0b0f14");
    const [showBeep, setShowBeep] = useState(false);
    const [freq, setFreq] = useState(600);
    const [volume, setVolume] = useState(0.1);

    const navigate = useNavigate();

    const timeline = useMemo(() => buildTimelineFromText(text), [text]);
    const unitMs = useMemo(() => unitMsFromWPM(wpm), [wpm]);

    const cancelRef = useRef({ cancelled: false });
    const audioRef = useRef();
    const gainRef = useRef();
    const oscRef = useRef();
    const runningRef = useRef(false);

    useEffect(() => {
        return () => stopAudio();
    }, []);

    function startAudio() {
        if (!showBeep) return;
        try {
            if (!audioRef.current) {
                audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioRef.current;
            stopAudio();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            gain.gain.value = 0;
            osc.type = "sine";
            osc.frequency.value = freq;
            osc.connect(gain).connect(ctx.destination);
            osc.start();

            gainRef.current = gain;
            oscRef.current = osc;
        } catch (e) {
            console.error(e.message);
        }
    }

    function stopAudio() {
        try {
            oscRef.current?.stop();
            oscRef.current?.disconnect();
            gainRef.current?.disconnect();
        } catch (e) {
            console.error(e.message);
        } finally {
            oscRef.current = undefined;
            gainRef.current = undefined;
        }
    }

    function setTone(on) {
        if (!showBeep || !gainRef.current || !audioRef.current) return;
        const now = audioRef.current.currentTime;
        const target = on ? Math.max(0, Math.min(1, volume)) : 0;
        gainRef.current.gain.cancelScheduledValues(now);
        gainRef.current.gain.linearRampToValueAtTime(target, now + 0.01);
    }

    async function playOnce() {
        if (!timeline.length) return;
        cancelRef.current.cancelled = false;
        runningRef.current = true;

        if (showBeep) startAudio();

        const prefersReduced =
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        for (let i = 0; i < timeline.length; i++) {
            if (cancelRef.current.cancelled) break;
            const { on, units } = timeline[i];

            setFlashON(prefersReduced ? false : on);
            setTone(on);

            await new Promise((r) => setTimeout(r, units * unitMs));
        }

        setFlashON(false);
        setTone(false);
        stopAudio();
        runningRef.current = false;
    }

    async function handlePlay() {
        if (runningRef.current) return;
        setIsPlaying(true);
        do {
            await playOnce();
            if (cancelRef.current.cancelled) break;
        } while (loop);
        setIsPlaying(false);
    }

    function handlePause() {
        cancelRef.current.cancelled = true;
        setIsPlaying(false);
        setFlashON(false);
        setTone(false);
        stopAudio();
        runningRef.current = false;
    }

    useEffect(() => {
        if (oscRef.current) {
            try {
                oscRef.current.frequency.value = freq;
            } catch { }
        }
    }, [freq]);

    useEffect(() => {
        if (gainRef.current && audioRef.current) {
            const now = audioRef.current.currentTime;
            gainRef.current.gain.cancelScheduledValues(now);
            gainRef.current.gain.linearRampToValueAtTime(
                Math.max(0, Math.min(1, isPlaying && showBeep && flashOn ? volume : 0)),
                now + 0.01
            );
        }
    }, [volume, showBeep]);

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate("/")}>
                Back
            </button>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Morse Code Flasher</h2>
                    <p className={styles.subtitle}>Convert text to blinking Morse code signals.</p>
                </header>

                <section className={styles.mainSection}>
                    <div className={styles.controls}>
                        <label className={styles.field}>
                            <span className={styles.label}>Text</span>
                            <textarea
                                className={styles.input}
                                rows={3}
                                placeholder="Type message…"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <div className={styles.hint}>
                                Unmapped characters are ignored. Spaces create word gaps.
                            </div>
                        </label>

                        <div className={styles.grid2}>
                            <label className={styles.field}>
                                <span className={styles.label}>Speed (WPM)</span>
                                <RangeSlider
                                    min={5} max={40} step={1}
                                    value={wpm}
                                    onChange={(e) => setWpm(parseInt(e.target.value, 10))}
                                />
                                <div className={styles.value}>{wpm} wpm</div>
                            </label>

                            <label className={styles.field}>
                                <span className={styles.label}>Unit duration</span>
                                <div className={styles.value}>{unitMs.toFixed(0)} ms / unit</div>
                            </label>
                        </div>

                        <div className={styles.grid3}>
                            <label className={styles.field}>
                                <span className={styles.label}>Flash color</span>
                                <input
                                    type="color"
                                    value={flashColor}
                                    onChange={(e) => setFlashColor(e.target.value)}
                                />
                            </label>

                            <label className={styles.field}>
                                <span className={styles.label}>Background</span>
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                />
                            </label>

                            <label className={styles.checkRow}>
                                <input
                                    type="checkbox"
                                    checked={loop}
                                    onChange={(e) => setLoop(e.target.checked)}
                                />
                                <span>Loop</span>
                            </label>
                        </div>

                        <details className={styles.advanced}>
                            <summary>Audio (optional)</summary>
                            <div className={styles.audioRow}>
                                <label className={styles.checkRow}>
                                    <input
                                        type="checkbox"
                                        checked={showBeep}
                                        onChange={(e) => setShowBeep(e.target.checked)}
                                    />
                                    <span>Enable tone</span>
                                </label>

                                <label className={styles.field}>
                                    <span className={styles.label}>Frequency</span>
                                    <RangeSlider
                                        min={300} max={1200} step={10}
                                        value={freq}
                                        onChange={(e) => setFreq(parseInt(e.target.value, 10))}
                                    />
                                    <div className={styles.value}>{freq} Hz</div>
                                </label>

                                <label className={styles.field}>
                                    <span className={styles.label}>Volume</span>
                                    <RangeSlider
                                        min={0} max={1} step={0.01}
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    />
                                    <div className={styles.value}>{Math.round(volume * 100)}%</div>
                                </label>
                            </div>
                            <div className={styles.hint}>
                                Your browser may require a user interaction before audio can play.
                            </div>
                        </details>

                        <div className={styles.actions}>
                            {!isPlaying ? (
                                <button className={styles.btn} onClick={handlePlay}>
                                    Play
                                </button>
                            ) : (
                                <button className={styles.btn} onClick={handlePause}>
                                    Pause
                                </button>
                            )}
                            <button className={styles.btnGhost} onClick={handlePause}>
                                Stop
                            </button>
                        </div>
                    </div>

                    <div className={styles.stage} style={{ backgroundColor: bgColor }}>
                        <div
                            className={styles.flash}
                            style={{
                                opacity: flashOn ? 1 : 0.1,
                                backgroundColor: flashColor,
                                boxShadow: flashOn ? `0 0 24px ${flashColor}` : "none",
                            }}
                        />
                    </div>
                </section>

                <section className={styles.readout}>
                    <div className={styles.readoutTitle}>Encoded preview</div>
                    <div className={styles.code}>
                        {text.split("").map((ch, idx) => {
                            if (ch === " ") return <span key={idx} className={styles.wordGap}> / </span>;
                            const code = MORSE_MAP[ch.toUpperCase()];
                            if (!code) return <span key={idx} className={styles.ignored}>{ch}</span>;
                            return (
                                <span key={idx} className={styles.letter}>
                                    <span className={styles.letterChar}>{ch}</span>
                                    <span className={styles.letterCode}>{code}</span>
                                </span>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
