import { FaGithub } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeProvider';
import styles from './Footer.module.css';


export default function Footer() {
  const { theme, toggle } = useTheme();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerDiv}>
        <p>&copy; Toolight {new Date().getFullYear()}</p>
        <div className={styles.navbar}>
          <a className={styles.link} href='/'>Home</a>
          <a className={styles.link} href='/about'>About</a>
          <a className={styles.link}>Updates</a>
          <label className={styles.themeSwitch} >
            <input type="checkbox" checked={theme === "light"} onChange={toggle} />
            <span className={styles.slider} />
          </label>
          <a className={styles.link}
            style={{
              display: "flex",
              gap: "0.3em",
              alignItems: "center"
            }}><FaGithub />Github</a>
        </div>
      </div>
    </footer>
  )
}
