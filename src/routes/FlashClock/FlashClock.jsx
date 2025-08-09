import { useNavigate } from 'react-router-dom';
import styles from './FlashClock.module.css';
import { useEffect, useRef, useState } from 'react';
import { CiBellOff, CiBellOn } from 'react-icons/ci';

function beep(audioCtx, duration = 200, frequency = 440, volume = 1) {

  try {
    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.value = volume;
    oscillator.frequency.value = frequency;
    oscillator.type = "square";

    oscillator.start();
    setTimeout(() => {
      try {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      } catch (_) { }
    }, duration);
  } catch (err) {

    console.warn('beep error', err);
  }
}

export default function FlashClock() {
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [flashInterval, setFlashInterval] = useState(5);
  const [flashEnabled, setFlashEnabled] = useState(true);

  const [alarm, setAlarm] = useState(null);
  const [isAlarm, setIsAlarm] = useState(false);

  const [flashPulse, setFlashPulse] = useState(false);
  const audioRef = useRef(null);
  const lastIntervalMinuteRef = useRef(null);
  const flashPulseTimeoutRef = useRef(null);

  const [resetLabel, setResetLabel] = useState('Reset');
  const resetTimeoutRef = useRef(null);


  function ensureAudioCtx() {
    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioRef.current;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      const now = new Date();
      const nowHHMM = now.toTimeString().slice(0, 5);


      if (isAlarm && alarm && nowHHMM === alarm) {
        console.log(`Alarm: ${alarm}, Now: ${nowHHMM}`);
        const ctx = ensureAudioCtx();
        beep(ctx, 180, 880, 0.8);

        setFlashPulse(true);
        if (flashPulseTimeoutRef.current) clearTimeout(flashPulseTimeoutRef.current);
        flashPulseTimeoutRef.current = setTimeout(() => setFlashPulse(false), 400);
      }


      if (flashEnabled) {
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const every = Math.max(1, Number(flashInterval) || 1);

        if (seconds === 0 && minutes % every === 0) {
          if (lastIntervalMinuteRef.current !== minutes) {
            lastIntervalMinuteRef.current = minutes;
            const ctx = ensureAudioCtx();
            beep(ctx, 220, 660, 0.9);


            setFlashPulse(true);
            if (flashPulseTimeoutRef.current) clearTimeout(flashPulseTimeoutRef.current);
            flashPulseTimeoutRef.current = setTimeout(() => setFlashPulse(false), 350);
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (flashPulseTimeoutRef.current) clearTimeout(flashPulseTimeoutRef.current);
    };
  }, [alarm, isAlarm, flashEnabled, flashInterval]);

  const handleAlarmSet = (e) => setAlarm(e.target.value);

  const handleResetClick = () => {

    setFlashInterval(5);
    setFlashEnabled(false);
    setAlarm(null);
    setIsAlarm(false);


    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    setResetLabel('Reseted!');
    resetTimeoutRef.current = setTimeout(() => {
      setResetLabel('Reset');
      resetTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>BACK</button>

      <div className={`${styles.card} ${flashPulse ? styles.flash : ''}`}
      style={{
        opacity: flashPulse ? 0.1 : 1
      }}>
        <h1 className={styles.title}>DIGITAL CLOCK</h1>
        <p className={styles.subtitle}>with Flash Alerts</p>

        <div className={styles.time}>{time}</div>

        <div className={styles.setting}>
          <label>
            <span>{flashEnabled ? 'Flashing every' : "Flash every"}</span>
            {flashEnabled ? flashInterval : (
              <input
                type="number"
                value={flashInterval}
                min={1}
                max={60}
                onChange={(e) => setFlashInterval(Math.max(1, Number(e.target.value || 1)))}
              />
            )}
          </label>
          <span>minutes</span>
        </div>

        <div className={styles.setting}>
          <label>
            <span>Set alarm for</span>
            <input type="time" defaultValue="08:30" onChange={handleAlarmSet} />
          </label>
          <span className={styles.icon} onClick={() => setIsAlarm(prev => !prev)}>
            {isAlarm ? <CiBellOn size={24} /> : <CiBellOff size={24} />}
          </span>
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.primary}
            onClick={() => setFlashEnabled(prev => !prev)}
            style={{
              backgroundColor: flashEnabled ? 'purple' : ''
            }}
          >
            {flashEnabled ? 'Stop' : 'Start'} Flash
          </button>
          <button
            className={styles.secondary}
            onClick={handleResetClick}
          >
            {resetLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
