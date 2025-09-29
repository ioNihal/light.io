import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header({ toolName }) {

    const navigate = useNavigate();


    return (
        <header className={styles.header}>
            <h1>{toolName}</h1>
            <div className={styles.btnGroup}>
                <span>Love</span>
                <button>Menu</button>
                <button onClick={() => navigate('/')}>Back</button>
            </div>
        </header>
    )
}
