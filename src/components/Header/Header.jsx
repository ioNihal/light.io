import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { useState } from 'react';

export default function Header({ toolName }) {
    const [liked, toggleLiked] = useState(false);

    const navigate = useNavigate();

    const handleLikeClick = () => {
        toggleLiked((prev) => !prev)
    }


    return (
        <div className={styles.header}>
            <h1>{toolName}</h1>
            <div className={styles.btnGroup}>
                <span className={styles.likeBtn} onClick={handleLikeClick}>{liked ? <GoHeartFill size={"1.5rem"} /> : <GoHeart size={"1.5rem"} />}</span>
                <button>Menu</button>
                <button onClick={() => navigate('/')}>Back</button>
            </div>
        </div>
    )
}
