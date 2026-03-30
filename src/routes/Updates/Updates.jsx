import ToolPage from '../../components/Common/ToolPage/ToolPage'
import styles from './Updates.module.css'

const updates = [
  {
    title: 'Route Design Refresh',
    date: 'Current pass',
    body: 'Tool routes were moved into a shared page shell with consistent spacing, responsive behavior, and theme-aware surfaces.',
  },
  {
    title: 'Dark Mode Cleanup',
    date: 'Current pass',
    body: 'New panels and overlays were adapted to dark mode so the updated routes no longer feel like light cards on a dark background.',
  },
  {
    title: 'Info Pages Added',
    date: 'Current pass',
    body: 'About was redesigned and an Updates page was added so the non-tool parts of the app match the refreshed system too.',
  },
]

export default function Updates() {
  const sidebar = (
    <>
      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Focus</span>
        <strong>Consistency first</strong>
        <p>This page tracks the visible product-level improvements rather than low-level implementation detail.</p>
      </div>

      <div className={styles.sideCard}>
        <span className={styles.sideLabel}>Next likely areas</span>
        <ul className={styles.list}>
          <li>Homepage nav wiring polish</li>
          <li>Visual refinement of older shared components</li>
          <li>More content-level polish and copy consistency</li>
        </ul>
      </div>
    </>
  )

  return (
    <ToolPage
      title="Updates"
      subtitle="A simple changelog-style view for major product and interface improvements."
      description="This page keeps track of meaningful app updates, especially the ones users can actually feel in the UI: route consistency, layout cleanup, dark-mode improvements, and navigation polish."
      sidebar={sidebar}
    >
      <div className={styles.timeline}>
        {updates.map((update) => (
          <article key={update.title} className={styles.entry}>
            <div className={styles.meta}>
              <span className={styles.date}>{update.date}</span>
            </div>
            <div className={styles.content}>
              <h2>{update.title}</h2>
              <p>{update.body}</p>
            </div>
          </article>
        ))}
      </div>
    </ToolPage>
  )
}
