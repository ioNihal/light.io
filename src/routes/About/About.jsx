import ToolPage from '../../components/Common/ToolPage/ToolPage'
import styles from './About.module.css'

export default function About() {
  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Project status</span>
        <strong>Actively evolving</strong>
        <p>The homepage is established and the tools are being brought into a cleaner shared system.</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Built with</span>
        <ul className={styles.list}>
          <li>Vite + React SPA foundations</li>
          <li>A custom tool-page design system</li>
          <li>Utility-first interactions focused on light and color experiments</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="About TooLight"
      subtitle="A browser-based playground for light, color, readability, and visual utility tools."
      description="TooLight started as a playful way to explore brightness and color interactions in the browser, then grew into a collection of practical and experimental tools. Some pages help with accessibility and color workflows, while others are simply meant to be fun, atmospheric, or visually inspiring."
      sidebar={sidebar}
    >
      <div className={styles.layout}>
        <section className={styles.panel}>
          <div className={styles.copyBlock}>
            <h2>Why TooLight</h2>
            <p>
              The idea was to keep light-focused tools in one place, from screen-based lamp utilities to palette builders,
              contrast checks, flashing experiments, and visual simulators. The app mixes practical helpers with exploratory
              ideas so it feels useful without losing its playful side.
            </p>
          </div>

          <div className={styles.copyBlock}>
            <h2>What This Project Tries To Do</h2>
            <p>
              Make small visual tools feel intentional, fast, and enjoyable to use. The current work has focused on bringing
              the routes into one consistent design language so the app feels like a single product instead of separate demos.
            </p>
          </div>

          <div className={styles.copyBlock}>
            <h2>Developer</h2>
            <p>
              Built by <strong>Nihal</strong>, a BCA student from Kasaragod, Kerala, with a clear interest in web interfaces,
              visual systems, and frontend experiments that reward detail. TooLight is a space to practice those ideas in public.
            </p>
          </div>
        </section>
      </div>
    </ToolPage>
  )
}
