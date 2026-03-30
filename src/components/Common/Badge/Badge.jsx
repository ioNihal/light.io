import React from 'react'
import styles from './Badge.module.css'

export default function Badge({ label, pass }) {
  return (
    <span role='status' aria-live='polite' className={[styles.badge, pass ? styles.pass : styles.fail].join(' ')}>
      {label}: {pass ? 'Pass' : 'Fail'}
    </span>
  )
}
