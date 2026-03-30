import React from 'react'
import Field from '../Field/Field'
import CopyButton from '../CopyButton/CopyButton'
import styles from './ColorField.module.css'

export default function ColorField({ label, color, hexValue, onColorChange, onHexChange, onCopy, error, placeholder }) {
  return (
    <Field label={label} error={error}>
      <div className={styles.row}>
        <input type="color" value={color} onChange={onColorChange} className={styles.colorInput} />
        <input className={styles.hexInput} value={hexValue} onChange={onHexChange} placeholder={placeholder} />
        <CopyButton text={hexValue} onCopy={onCopy} />
      </div>
    </Field>
  )
}
