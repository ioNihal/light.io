import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { GoHeart } from 'react-icons/go';

export default function Header({ toolName }) {

    const navigate = useNavigate();


    return (
        <header className={styles.header}>
            <h1>{toolName}</h1>
            <div className={styles.btnGroup}>
                <span className={styles.likeBtn}><GoHeart size={"1.5rem"} /></span>
                <button>Menu</button>
                <button onClick={() => navigate('/')}>Back</button>
            </div>
        </header>
    )
}
