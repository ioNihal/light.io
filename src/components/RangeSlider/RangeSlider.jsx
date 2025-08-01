import styles from "./RangeSlider.module.css";

function RangeSlider({
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    disabled = false,
    label = "RangeSlider",
}) {
    return (
        <input
            type="range"
            name={label}
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={onChange}
            className={`${styles.slider} ${disabled ? styles.hide : ""}`}
        />
    );
}

export default RangeSlider;
