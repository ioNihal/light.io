import styles from './Sidebar.module.css';

import { tools } from '../../data/tools';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { useMemo, useState, useEffect } from 'react';
import { HiOutlineHome } from 'react-icons/hi';
import { BiLibrary } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import { RiInformationLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeProvider';
import { CiDark, CiLight } from 'react-icons/ci';
import { FaGithub } from 'react-icons/fa';

export default function Sidebar() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeButton, setActiveButton] = useState('home');
    const [showSidebar, setShowSidebar] = useState(false); // Default to collapsed on desktop? No, default false means "hide" class is added?
    // In CSS: .sidebar.hide is applied when !showSidebar.
    // So if showSidebar is false, it is hidden/collapsed.

    // Let's adjust default state based on screen size?
    // For now, let's just make it toggleable.

    const navigate = useNavigate();
    const { theme, toggle } = useTheme();

    const toggleSidebar = () => {
        setShowSidebar(prev => !prev);
    }

    // Close sidebar on mobile when navigating
    const handleNavigation = (path, id) => {
        navigate(path);
        setActiveButton(id);
        if (window.innerWidth <= 768) {
            setShowSidebar(false);
        }
    }

    const sorted = [...tools].sort((a,b) => a.title.localeCompare(b.title));
    
    return (
        <>
            {/* Mobile Toggle Button (outside sidebar) */}
            <button
                className={styles.mobileToggleBtn}
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
            >
               <GoSidebarExpand size={24} />
            </button>

            {/* Overlay for mobile when sidebar is open */}
            <div
                className={`${styles.overlay} ${showSidebar ? styles.show : ''}`}
                onClick={() => setShowSidebar(false)}
            />

            <aside className={`${styles.sidebar} ${!showSidebar ? styles.hide : ''}`}>
                <div className={styles.logo}>
                    <h1>Toolight</h1>
                    <i className={styles.collapseBtn} onClick={toggleSidebar} title={showSidebar ? 'Close' : 'Open'}>
                        {showSidebar ? <GoSidebarCollapse size={24} /> : <GoSidebarExpand size={24} />}
                    </i>
                </div>
                <nav className={styles.nav}>
                    <button
                        className={`${styles.navBtn} ${activeButton === 'home' ? styles.active : ''}`}
                        onClick={() => handleNavigation('/', 'home')}
                        title='Home'>
                        <i className={styles.menuIcon}><HiOutlineHome /></i>
                        <span className={styles.label}>Home</span>
                    </button>
                    <button
                        className={styles.navBtn}
                        onClick={() => setShowDropdown(prev => !prev)}
                        title='Library'>
                        <i className={styles.menuIcon}><BiLibrary /></i>
                        <span className={styles.label}>Library</span>
                        <i className={styles.arrow} style={{
                            transform: `rotateZ(${showDropdown ? '-180deg' : '0deg'})`
                        }}><IoIosArrowDown /></i>
                    </button>
                    <div className={`${styles.dropDownMenu} ${!showDropdown ? styles.hide : ''}`}>
                        {sorted.map(({ id, title, icon: Icon }) => (
                            <button
                                className={`${styles.navSecondBtn} ${activeButton === id.toString() ? styles.active : ''}`}
                                key={id}
                                onClick={() => handleNavigation(`/${title.split(" ").join("-").toLowerCase()}`, id.toString())}
                                title={title}>
                                <i className={styles.icon}>
                                    <Icon />
                                </i>
                                <span className={styles.label}>{title}</span>
                            </button>
                        ))}
                    </div>
                    <button className={`${styles.navBtn} ${activeButton === 'about' ? styles.active : ''}`}
                     onClick={() => handleNavigation('/about', 'about')}
                    title='About'>
                        <i className={styles.menuIcon}><RiInformationLine /></i>
                        <span className={styles.label}>About</span>
                    </button>
                </nav>

                <div className={styles.footer}>
                     <button className={styles.themeBtn} onClick={toggle} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
                        {theme === 'light' ? <CiDark size={20} /> : <CiLight size={20} />}
                        <span className={styles.label}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                     <a href="https://github.com/nihalptm/toolight" target="_blank" rel="noreferrer" className={styles.githubLink} title="Github">
                        <FaGithub size={20} />
                        <span className={styles.label}>Github</span>
                    </a>
                </div>
            </aside>
        </>
    );
}
