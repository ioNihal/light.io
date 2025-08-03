import styles from './About.module.css';

export default function About() {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>About TooLight</h1>

            <p className={styles.text}>
                Welcome to <strong>TooLight</strong> (orignally Light.io) a playful web app built to explore brightness, color, and light effects right in your browser.
                It's <em>currently in active development</em>, so you may encounter occasional quirks or unfinished features.
                Think of it as a sandbox for experimenting with HSL color generators, light themes, and fun utilities with just a few clicks.
            </p>

            <h2 className={styles.subheading}>Why “TooLight”?</h2>
            <p className={styles.text}>
                I wanted a unified place to fiddle with light-based helpers everything from a full-screen lamp to theme generators.
                While some modules have practical uses (contrast checking, color converters), most are here for fun and inspiration.
            </p>

            <h2 className={styles.subheading}>Meet the Developer</h2>
            <p className={styles.text}>
                I'm <strong>Nihal</strong>, a BCA student from Kasaragod, Kerala, passionate about web development and visual experiences.
                When I'm not studying, you'll find me building side-projects, experimenting with React, or tweaking CSS themes until they feel just right.
            </p>

            <p className={styles.footer}>
                Stay tuned, more features are on the way! 🚀
            </p>
        </div>
    );
}
