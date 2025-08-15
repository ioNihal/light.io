import { useState } from 'react';
import styles from './FlashMemoryTest.module.css';
import { useNavigate } from 'react-router-dom';


const COLORS = [
    { id: 0, name: "Green", base: "green", glow: "greenGlow" },
    { id: 1, name: "Red", base: "red", glow: "redGlow" },
    { id: 2, name: "Yellow", base: "yellow", glow: "yellowGlow" },
    { id: 3, name: "Blue", base: "blue", glow: "blueGlow" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function FlashMemoryTest() {

    const [sequence, setSequence] = useState([]);
    const [userStep, setUserStep] = useState(0);
    const [level, setLevel] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [showing, setShowing] = useState(false);

    const [activeId, setActiveId] = useState(null);
    const [strict, setStrict] = useState(false);

    const [speed, setSpeed] = useState(650);
    const [message, setMessage] = useState("Press start to play!");
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() =>
        parseInt(localStorage.getItem('flashGameHS') || "0", 10));

    const navigate = useNavigate();


    const flashOnce = async (id, dur = 350) => {
        setActiveId(id);
        //can start a ton ;) not implemented
        await sleep(dur);
        setActiveId(null);
        //stopsound() also here :/ not done
    };

    const playBack = async (seq) => {
        setShowing(true);
        await sleep(400);
        for (const id of seq) {
            setActiveId(id);
            //small sound here >_-
            await sleep(speed);
            setActiveId(null);
            //stop sound
            await sleep(Math.max(120, speed * 0.35));
        }
        setShowing(false);
    }

    const startGame = async () => {
        setPlaying(true);
        setMessage("Watch the sequence carefully!");
        setSequence([]);
        setUserStep(0);
        setLevel(0);
        setScore(0);
        setSpeed(650);

        await nextRound([]);
    };


    const nextRound = async (prevSeq = sequence) => {
        const nextId = Math.floor(Math.random() * 4);
        const newSeq = [...prevSeq, nextId];
        setSequence(newSeq);
        setLevel((l) => l + 1);
        setUserStep(0);
        setSpeed((s) => Math.max(250, Math.floor(s * 0.95))); //speed up next round

        await playBack(newSeq);
        setMessage("Your Turn!")
    };


    const handleInput = async (id) => {
        if (!playing || showing) return;
        await flashOnce(id, Math.max(200, speed * 0.6));

        if (id !== sequence[userStep]) {
            if (strict) {
                setMessage("Wrong! Game Over...");
                setPlaying(false);
                setHighScore((hs) => {
                    const newHS = Math.max(hs, score);
                    localStorage.setItem('flashGameHS', String(newHS));
                    return newHS;
                });
            } else {
                setMessage("Oops! watch again...");
                setUserStep(0);
                await playBack(sequence);
                setMessage("Your turn now!");
            }
            return;
        }

        const nextStep = userStep + 1;
        setUserStep(nextStep);

        if (nextStep === sequence.length) {
            const newScore = score + 10 + Math.max(0, 10 - Math.floor(sequence.length / 2));
            setScore(newScore);
            setHighScore((hs) => {
                const newHS = Math.max(hs, newScore);
                localStorage.setItem('flashGameHS', String(newHS));
                return newHS;
            });
            setMessage("Nice! Next Round...");
            await sleep(550);
            await nextRound();
        }

    }



    return (
        <div className={styles.container}>
              <button className={styles.backBtn} onClick={() => navigate('/')}>BACK</button>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <h2>Flash Memory Test</h2>
                    <p>Challenge your memory with flashing color sequences.</p>
                </header>
                <section className={styles.statsRow}>
                    <div className={styles.badges}>
                        <span>Level: <b>{level}</b></span>
                        <span>Score: <b>{score}</b></span>
                        <span>High: <b>{highScore}</b></span>
                    </div>
                    <label className={styles.strict}>
                        <input
                            type="checkbox"
                            checked={strict}
                            onChange={(e) => setStrict(e.target.checked)}
                        />
                        Strict Mode
                    </label>
                </section>
                <div className={styles.grid}>
                    {COLORS.map((c) => {
                        const isActive = activeId === c.id;
                        return (
                            <button key={c.id}
                                onClick={() => handleInput(c.id)}
                                disabled={!playing || showing}
                                aria-label={c.name}
                                className={`${styles.tile} ${styles[c.base]} ${isActive ? styles[c.glow] : ''}`} />
                        );
                    })}
                </div>

                <div className={styles.controls}>
                    <button onClick={startGame} disabled={showing} className={styles.primary}>
                        {playing ? "Restart" : "Start"}
                    </button>
                    <div className={styles.message} aria-live="polite" aria-atomic="true">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    )
}
