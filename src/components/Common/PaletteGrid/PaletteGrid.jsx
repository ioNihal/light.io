import React, { useState } from 'react'
import styles from './PaletteGrid.module.css'
import CopyButton from '../CopyButton/CopyButton'

export default function PaletteGrid({ colors = [], onCopy }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      if (onCopy) onCopy(hex);
      setTimeout(() => setCopied(null), 1200);
    } catch (e) {
      console.error('copy failed', e);
    }
  }

  return (
    <div className={styles.grid}>
      {colors.map((hex, i) => (
        <button key={hex + i} className={styles.tile} style={{ backgroundColor: hex }} onClick={() => handleCopy(hex)} title={`Copy ${hex}`}>
          <div className={styles.info}>{hex}</div>
          {copied === hex && <span className={styles.copied}>Copied</span>}
          <span className={styles.hint}>Click to copy</span>
        </button>
      ))}
    </div>
  )
}
