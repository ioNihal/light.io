import React, { useEffect, useState } from 'react'
import styles from './CopyButton.module.css'

export default function CopyButton({ text, label = 'Copy', successLabel = 'Copied', className = '', onCopy }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (onCopy) onCopy(text);
    } catch (e) {
      console.error('Copy failed', e);
    }
  }

  return (
    <button className={[styles.btn, className].filter(Boolean).join(' ')} onClick={handle} aria-live="polite">
      {copied ? successLabel : label}
    </button>
  )
}
