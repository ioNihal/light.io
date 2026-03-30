import React from 'react'
import styles from './Field.module.css'

export default function Field({ label, hint, error, children, className = '' }) {
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.control}>{children}</div>
      {hint && <div className={styles.hint}>{hint}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
