import styles from './Sidebar.module.css';

import { tools } from '../../data/tools';
import { GoSidebarExpand } from 'react-icons/go';
import { useState } from 'react';
import { HiOutlineHome } from 'react-icons/hi';
import { BiLibrary } from 'react-icons/bi';
import { IoIosArrowDown } from 'react-icons/io';
import { RiInformationLine } from 'react-icons/ri';

export default function Sidebar() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeButton, setActiveButton] = useState('home');
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(prev => !prev);
    }

    return (
        <aside className={`${styles.sidebar} ${!showSidebar ? styles.hide : ''}`}>
            <div className={styles.logo}>
                <h1>Light.io</h1>
                <i className={styles.collapseBtn} onClick={toggleSidebar} title={showSidebar ? 'Close' : 'Open'}><GoSidebarExpand size={24} /></i>
            </div>
            <nav className={styles.nav}>
                <button
                    className={`${styles.navBtn} ${activeButton === 'home' ? styles.active : ''}`}
                    onClick={() => setActiveButton('home')}
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
                    {tools.map(({ id, title, icon: Icon }) => (
                        <button
                            className={`${styles.navSecondBtn} ${activeButton === id.toString() ? styles.active : ''}`}
                            key={id}
                            onClick={() => setActiveButton(id.toString())}
                            title={title}>
                            <i className={styles.icon}>
                                <Icon />
                            </i>
                            <span className={styles.label}>{title}</span>
                        </button>
                    ))}
                </div>
                <button className={`${styles.navBtn} ${activeButton === 'about' ? styles.active : ''}`}
                 onClick={() => {
                    setActiveButton('about');
                }}
                title='About'>
                    <i className={styles.menuIcon}><RiInformationLine /></i>
                    <span className={styles.label}>About</span>
                </button>
            </nav>
        </aside>
    );
}
