import React from 'react'
import styles from './Button.module.css'

export default function Button({ children, variant = 'primary', size = 'md', onClick, className = '', ...rest }) {
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')
  return (
    <button className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
