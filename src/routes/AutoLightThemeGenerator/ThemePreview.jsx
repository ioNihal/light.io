import { BiCopy } from 'react-icons/bi';
import styles from './ThemePreview.module.css';
import { useEffect, useState } from 'react';
import { TiTick } from 'react-icons/ti';
import { FaCheck } from 'react-icons/fa';

/**
 * @param {string} label 
 * @param {Array<{label, color, onColor}>} palette 
 * @param {(name:string, color:string)=>void} onCopyToken
 */
export default function ThemePreview({ label, palette, onCopyToken, copiedToken, type }) {
    const [
        { color: primary, onColor: onPrimary = '#000' },
        { color: accent, onColor: onAccent = '#000' },
        { color: surface, onColor: onSurface = '#000' },
        extra1 = {}, extra2 = {}
    ] = palette;

    const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <div className={styles.container}>
            <div className={styles.wrapper} style={{ background: primary, color: onSurface }}>

                <header
                    className={styles.nav}
                    style={{ background: accent }}
                >
                    <h1 className={styles.navTitle} style={{ color: onAccent }}>{label}</h1>
                    <button
                        className={styles.navBtn}
                        style={{ background: surface, color: onSurface }}
                        onClick={() => onCopyToken(palette[1].label, accent)}
                    >
                        Sign Up
                    </button>
                </header>


                <div className={styles.hero}>
                    <h2 className={styles.headline} style={{ color: onPrimary }}>
                        Welcome to your new theme
                    </h2>
                    <p className={styles.subhead} style={{ color: onPrimary }}>
                        This hero section uses all {palette.length} of your chosen colors.
                    </p>
                    <button
                        className={styles.cta}
                        style={{ background: accent, color: onAccent }}
                        onClick={() => onCopyToken(palette[0].label, primary)}
                    >
                        Get Started
                    </button>
                </div>

                {/* EXTRA CARDS */}
                {(extra1.color || extra2.color) && (
                    <div className={styles.extras}>
                        {extra1.color && (
                            <div
                                className={styles.card}
                                style={{ background: extra1.color, color: extra1.onColor }}
                                onClick={() => onCopyToken(palette[3].label, extra1.color)}
                            >
                                <h3>Card One</h3>
                                <p>Color #{3 + 1}</p>
                            </div>
                        )}
                        {extra2.color && (
                            <div
                                className={styles.card}
                                style={{ background: extra2.color, color: extra2.onColor }}
                                onClick={() => onCopyToken(palette[4].label, extra2.color)}
                            >
                                <h3>Card Two</h3>
                                <p>Color #{4 + 1}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>


            <ul className={styles.paletteWrapper}>
                <li style={{
                    background: primary,
                    color: onPrimary
                }}>{capitalize(palette[0]?.label)}:&nbsp;{primary.toUpperCase()}&nbsp;{copiedToken === `${type === 'light' ? 'primaryLight' : 'primaryDark'}` ? <FaCheck style={{ color: onPrimary }} size={16} /> :
                    <BiCopy
                        title='copy'
                        style={{ color: onPrimary }}
                        size={16}
                        onClick={() => onCopyToken(palette[0]?.label, primary, `${type === 'light' ? 'primaryLight' : 'primaryDark'}`)} />}
                </li>
                <li style={{
                    background: surface,
                    color: onSurface
                }}>{capitalize(palette[2]?.label)}:&nbsp;{surface.toUpperCase()}&nbsp;{copiedToken === `${type === 'light' ? 'surfaceLight' : 'surfaceDark'}` ? <FaCheck style={{ color: onSurface }} size={16} /> :
                    <BiCopy style={{ color: onSurface }} size={16} onClick={() => onCopyToken(palette[2]?.label, surface, `${type === 'light' ? 'surfaceLight' : 'surfaceDark'}`)} />}
                </li>
                <li style={{
                    background: accent,
                    color: onAccent
                }}>{capitalize(palette[2]?.label)}:&nbsp;{accent.toUpperCase()}&nbsp;{copiedToken === `${type === 'light' ? 'accentLight' : 'accentDark'}` ? <FaCheck style={{ color: onAccent }} size={16} /> :
                    <BiCopy style={{ color: onAccent }} size={16} onClick={() => onCopyToken(palette[1]?.label, accent, `${type === 'light' ? 'accentLight' : 'accentDark'}`)} />}
                </li>
                {extra1.color && (
                    <>
                        <li style={{
                            background: extra1.color,
                            color: extra1.onColor
                        }}>{capitalize(palette[3]?.label)}:&nbsp;{extra1?.color?.toUpperCase()}&nbsp;{copiedToken === `${type === 'light' ? 'extra1Light' : 'extra1Dark'}` ? <FaCheck style={{ color: extra1.onColor }} size={16} /> :
                            <BiCopy style={{ color: extra1.onColor }} size={16} onClick={() => onCopyToken(palette[3]?.label, extra1.onColor, `${type === 'light' ? 'extra1Light' : 'extra1Dark'}`)} />}
                        </li>
                    </>
                )}
                {extra2.color && (
                    <>
                        <li style={{
                            background: extra2.color,
                            color: extra2.onColor
                        }}>{capitalize(palette[4]?.label)}:&nbsp;{extra2?.color?.toUpperCase()}&nbsp;{copiedToken === `${type === 'light' ? 'extra2Light' : 'extra2Dark'}` ? <FaCheck style={{ color: extra2.onColor }} size={16} /> :
                            <BiCopy style={{ color: extra2.onColor }} size={16} onClick={() => onCopyToken(palette[4]?.label, extra2.color, `${type === 'light' ? 'extra2Light' : 'extra2Dark'}`)} />}
                        </li>
                    </>
                )}
                <li style={{
                    background: onPrimary,
                    color: primary
                }}>onColor:&nbsp;{onPrimary.toUpperCase()}&nbsp;{copiedToken === `${type === 'light' ? 'onColorLight' : 'onColorDark'}` ? <FaCheck style={{ color: primary }} size={16} /> :
                    <BiCopy style={{ color: primary }} size={16} onClick={() => onCopyToken('onColor', onPrimary, `${type === 'light' ? 'onColorLight' : 'onColorDark'}`)} />}
                </li>
            </ul>
        </div>
    );
}
