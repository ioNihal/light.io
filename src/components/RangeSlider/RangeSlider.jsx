import styles from "./RangeSlider.module.css";

function RangeSlider({
    id = 'customRangeSlider',
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    disabled = false,
    label = "RangeSlider",

    trackHeight = 16,
    thumbSize = 16,
}) {

    const cssVars = {
        "--track-height": `${trackHeight}px`,
        "--thumb-size": `${thumbSize}px`,
    };


    return (
        <input
            id={id}
            type="range"
            name={label}
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={onChange}
            className={`${styles.slider} ${disabled ? styles.hide : ""}`}
            style={cssVars}
        />
    );
}

export default RangeSlider;
