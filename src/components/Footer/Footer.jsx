import { FaGithub } from 'react-icons/fa'
import { useTheme } from '../../contexts/ThemeProvider'
import styles from './Footer.module.css'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerDiv}>
        <p>&copy; Toolight {new Date().getFullYear()}</p>
        <div className={styles.navbar}>
          <a className={styles.link} href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a>
          <a className={styles.link} href="/about" onClick={(e) => { e.preventDefault(); navigate('/about') }}>About</a>
          <a className={styles.link} href="/updates" onClick={(e) => { e.preventDefault(); navigate('/updates') }}>Updates</a>
          <label className={styles.themeSwitch}>
            <input type="checkbox" checked={theme === 'light'} onChange={toggle} />
            <span className={styles.slider} />
          </label>
          <a
            className={styles.link}
            style={{ display: 'flex', gap: '0.3em', alignItems: 'center' }}
          >
            <FaGithub />Github
          </a>
        </div>
      </div>
    </footer>
  )
}
