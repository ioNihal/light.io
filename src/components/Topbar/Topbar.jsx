import { useTheme } from '../../contexts/ThemeProvider';
import styles from './Topbar.module.css';


export default function Topbar() {
  const { theme, toggle } = useTheme();
  return (
    <header className={styles.topbar}>
      {/* <input type="text" className={styles.searchInput} placeholder="Search projects..." /> */}
      <div className={styles.btnWrapper}>
        <button className={styles.themeBtn} onClick={toggle}>{theme}</button>
        <button className={styles.githubRepoBtn}>GITHUB</button>
    
      </div>
    </header>
  )
}
