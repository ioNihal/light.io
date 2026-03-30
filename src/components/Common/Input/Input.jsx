import React from 'react'
import styles from './Input.module.css'

export default function Input({ label, value, onChange, placeholder = '', type = 'text', className = '', ...rest }) {
  return (
    <label className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {label && <div className={styles.label}>{label}</div>}
      <input className={styles.input} value={value} onChange={onChange} placeholder={placeholder} type={type} {...rest} />
    </label>
  )
}
