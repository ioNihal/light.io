import { useTheme } from '../../contexts/ThemeProvider';
import { capitalizeFirstLetter } from '../../utils/formatHelpers';
import styles from './Footer.module.css';


export default function Footer() {
  const { theme, toggle } = useTheme();
  return (
    <footer className={styles.footer}>
      <p>Toolight&copy;{new Date().getFullYear()}</p>
      <div className={styles.navbar}>
        <a className={styles.link} href='/'>Home</a>
        <a className={styles.link} href='/about'>About</a>
        <a className={styles.link}>Updates</a>
        <button className={styles.themeBtn} onClick={toggle}>{capitalizeFirstLetter(theme)} mode</button>
        <a className={styles.link}>Github</a>
      </div>
    </footer>
  )
}
