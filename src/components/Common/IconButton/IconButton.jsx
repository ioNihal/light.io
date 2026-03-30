import React from 'react'
import styles from './IconButton.module.css'

export default function IconButton({ icon: Icon, title, onClick, className = '' }) {
  return (
    <button className={[styles.btn, className].filter(Boolean).join(' ')} onClick={onClick} title={title}>
      {Icon && <Icon />}
    </button>
  )
}
