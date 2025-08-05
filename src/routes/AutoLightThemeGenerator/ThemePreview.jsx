import { BiCopy } from 'react-icons/bi';
import styles from './ThemePreview.module.css';

/**
 * @param {string} label 
 * @param {Array<{label, color, onColor}>} palette 
 * @param {(name:string, color:string)=>void} onCopyToken
 */
export default function ThemePreview({ label, palette, onCopyToken }) {
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
                <li>{capitalize(palette[0]?.label)}: {primary.toUpperCase()} <BiCopy size={16} onClick={() => onCopyToken(palette[0].label, primary)} /></li>
                <li>on{capitalize(palette[0]?.label)}: {onPrimary.toUpperCase()} <BiCopy size={16} onClick={() => onCopyToken(`on${palette[0].label}`, onPrimary)} /></li>
                <li>{capitalize(palette[2]?.label)}: {surface.toUpperCase()} <BiCopy size={16} onClick={() => onCopyToken(palette[2].label, surface)} /></li>
                <li>on{capitalize(palette[2]?.label)}: {onSurface.toUpperCase()} <BiCopy size={16} onClick={() => onCopyToken(`on${palette[2].label}`, onSurface)} /></li>
                <li>{capitalize(palette[2]?.label)}: {accent.toUpperCase()} <BiCopy size={16} onClick={() => onCopyToken(palette[1].label, accent)} /></li>
                <li>on{capitalize(palette[2]?.label)}: {onAccent.toUpperCase()} <BiCopy size={16} onClick={() => onCopyToken(`on${palette[1].label}`, onAccent)} /></li>
            </ul>
        </div>
    );
}
