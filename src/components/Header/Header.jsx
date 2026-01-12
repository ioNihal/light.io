import styles from './Header.module.css';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { useState } from 'react';

export default function Header({ toolName }) {
    const [liked, toggleLiked] = useState(false);

    const handleLikeClick = () => {
        toggleLiked((prev) => !prev)
    }

    return (
        <div className={styles.header}>
            <h1>{toolName}</h1>
            <div className={styles.btnGroup}>
                <button className={styles.likeBtn} onClick={handleLikeClick} title="Like this tool">
                    {liked ? <GoHeartFill size={"1.5rem"} /> : <GoHeart size={"1.5rem"} />}
                </button>
            </div>
        </div>
    )
}
