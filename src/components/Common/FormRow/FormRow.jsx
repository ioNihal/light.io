import React from 'react'
import styles from './FormRow.module.css'

export default function FormRow({ children, gap = '1rem', align = 'center', className = '' }) {
  return (
    <div className={[styles.row, className].filter(Boolean).join(' ')} style={{ gap, alignItems: align }}>
      {children}
    </div>
  )
}
