import React from 'react'
import Field from '../Field/Field'
import styles from './NumberField.module.css'

export default function NumberField({ label, value, onChange, min, max, step = 1, placeholder, error, ...rest }) {
  return (
    <Field label={label} error={error}>
      <input
        className={styles.input}
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        {...rest}
      />
    </Field>
  )
}
