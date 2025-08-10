import { useEffect, useRef, useState } from "react";
import styles from "./ColorBlindness.module.css";
import { applyColorBlindness } from "./filters";
import { useNavigate } from "react-router-dom";
import { FcAddImage } from "react-icons/fc";
import { FaArrowTurnUp } from "react-icons/fa6";



const OPTIONS = [
    { value: "none", label: "Normal" },
    { value: "protanopia", label: "Protanopia" },
    { value: "deuteranopia", label: "Deuteranopia" },
    { value: "tritanopia", label: "Tritanopia" },
    { value: "achromatopsia", label: "Achromatopsia" },
];

export default function ColorBlindness() {
    const [imgSrc, setImgSrc] = useState(null);
    const [mode, setMode] = useState("none");
    const [modeOpen, setModeOpen] = useState(false);

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const dropRef = useRef(null);
    const selectBoxRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        const onDocClick = (e) => {
            if (selectBoxRef.current && !selectBoxRef.current.contains(e.target)) {
                setModeOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);


    const handleFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImgSrc(reader.result);
        reader.readAsDataURL(file);
    };

    const handleUploadChange = (e) => {
        const file = e.target.files && e.target.files[0];
        handleFile(file);
    };


    useEffect(() => {
        const dropEl = dropRef.current;
        if (!dropEl) return;

        const onDragOver = (e) => {
            e.preventDefault();
            dropEl.classList.add(styles.dragOver);
        };
        const onDragLeave = (e) => {
            e.preventDefault();
            dropEl.classList.remove(styles.dragOver);
        };
        const onDrop = (e) => {
            e.preventDefault();
            dropEl.classList.remove(styles.dragOver);
            const file = e.dataTransfer.files && e.dataTransfer.files[0];
            handleFile(file);
        };

        dropEl.addEventListener("dragover", onDragOver);
        dropEl.addEventListener("dragleave", onDragLeave);
        dropEl.addEventListener("drop", onDrop);

        return () => {
            dropEl.removeEventListener("dragover", onDragOver);
            dropEl.removeEventListener("dragleave", onDragLeave);
            dropEl.removeEventListener("drop", onDrop);
        };
    }, []);


    useEffect(() => {
        if (!imgSrc) return;
        if (mode === "none") return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imgSrc;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;


            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);


            applyColorBlindness(ctx, img.width, img.height, mode);


            canvas.style.width = "100%";
            canvas.style.height = "auto";
        };

        img.onerror = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [imgSrc, mode]);

    return (
        <div className={styles.page}>
            <button className={styles.backBtn} onClick={() => navigate("/")}>
                Back
            </button>

            <h1 className={styles.pageTitle}>Color Blindness Simulator</h1>
            <div className={styles.card}>
                <div className={styles.left}>
                    <p className={styles.warning}>This function is CPU-bound and iterates every pixel (4 bytes per pixel)!</p>
                    <div
                        className={styles.dropzone}
                        ref={dropRef}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                fileInputRef.current && fileInputRef.current.click();
                            }
                        }}
                    >
                        {!imgSrc ? (
                            <>
                                <div className={styles.dropIcon}><FaArrowTurnUp size={16} /></div>
                                <div className={styles.dropTitle}>Drag and drop an image here</div>
                                <div className={styles.dropSub}>or</div>
                                <button
                                    type="button"
                                    className={styles.browseBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current && fileInputRef.current.click();
                                    }}
                                >
                                    Browse files
                                </button>
                            </>
                        ) : (
                            <>
                                <img
                                    src={imgSrc}
                                    alt="uploaded preview"
                                    className={styles.thumb}
                                />
                                <div className={styles.changeRow}>
                                    <button
                                        type="button"
                                        className={styles.browseBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current && fileInputRef.current.click();
                                        }}
                                    >
                                        Change file
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.clearBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImgSrc(null);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className={styles.hiddenInput}
                            onChange={handleUploadChange}
                        />
                    </div>

                    <div style={{ marginTop: 18 }}>
                        <div className={styles.label}>Color Vision Type</div>

                        <ul className={styles.selectBox} ref={selectBoxRef}>
                            <li
                                className={`${styles.trigger} ${modeOpen ? styles.open : ""}`}
                                onClick={() => setModeOpen((p) => !p)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setModeOpen((p) => !p);
                                    } else if (e.key === "Escape") {
                                        setModeOpen(false);
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-haspopup="listbox"
                                aria-expanded={modeOpen}
                            >
                                <span>{OPTIONS.find((o) => o.value === mode)?.label}</span>
                                <span className={styles.triggerArrow}>▾</span>
                            </li>

                            <li className={`${styles.options} ${modeOpen ? styles.open : ""}`}>
                                <ul role="listbox" aria-activedescendant={mode}>
                                    {OPTIONS.map((opt) => (
                                        <li
                                            key={opt.value}
                                            role="option"
                                            aria-selected={mode === opt.value}
                                            onClick={() => {
                                                setMode(opt.value);
                                                setModeOpen(false);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    setMode(opt.value);
                                                    setModeOpen(false);
                                                }
                                            }}
                                            tabIndex={0}
                                            className={
                                                mode === opt.value ? styles.optionActive : undefined
                                            }
                                        >
                                            {opt.label}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>


                <div className={styles.right}>
                    <h3 className={styles.previewTitle}>Preview</h3>
                    <div className={styles.previewBox}>
                        {!imgSrc ? (
                            <div className={styles.previewPlaceholder}>
                                <div className={styles.placeholderIcon}><FcAddImage size={16} /></div>
                                <div className={styles.placeholderText}>No image selected</div>
                            </div>
                        ) : mode === "none" ? (
                            <img
                                src={imgSrc}
                                alt="preview normal"
                                className={styles.previewImg}
                            />
                        ) : (
                            <canvas ref={canvasRef} className={styles.previewCanvas} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
