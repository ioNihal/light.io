import React from 'react'
import styles from './Card.module.css'

export default function Card({ icon: Icon, title, desc, onClick, className = '' }) {
  return (
    <article className={[styles.card, className].filter(Boolean).join(' ')} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : -1}>
      <div className={styles.iconArea}>{Icon && <Icon />}</div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        {desc && <div className={styles.desc}>{desc}</div>}
      </div>
    </article>
  )
}
