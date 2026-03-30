import { useNavigate } from 'react-router-dom'
import Button from '../Button/Button'
import styles from './ToolPage.module.css'

export default function ToolPage({
  title,
  subtitle,
  description,
  meta,
  actions,
  sidebar,
  children,
  contentClassName = '',
}) {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            Back To Tools
          </Button>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Lighting Tool</p>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>
          {meta ? <div className={styles.meta}>{meta}</div> : null}
        </header>

        {description ? <div className={styles.description}>{description}</div> : null}

        <div className={[styles.content, sidebar ? styles.withSidebar : '', contentClassName].filter(Boolean).join(' ')}>
          <div className={styles.main}>{children}</div>
          {sidebar ? <aside className={styles.sidebar}>{sidebar}</aside> : null}
        </div>
      </div>
    </div>
  )
}
