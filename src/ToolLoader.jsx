import { lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";


const ScreenLight = lazy(() => import('./routes/ScreenLight/ScreenLight'));
const AmbientColorCycler = lazy(() => import('./routes/AmbientColorCycler/AmbientColorCycler'));
const ColorLightPicker = lazy(() => import('./routes/ColorLightPicker/ColorLightPicker'));
const AutoLightThemeGenerator = lazy(() => import('./routes/AutoLightThemeGenerator/AutoLightThemeGenerator'));
const FlashClock = lazy(() => import('./routes/FlashClock/FlashClock'));
const ColorBlindness = lazy(() => import('./routes/ColorBlindness/ColorBlindness'));

export default function ToolLoader() {
    const { toolName } = useParams();
    const navigate = useNavigate();
    let Component = null;

    switch (toolName) {
        case 'screen-light': Component = ScreenLight; break;
        case 'ambient-color-cycler': Component = AmbientColorCycler; break;
        case 'color-light-picker': Component = ColorLightPicker; break;
        case 'auto-light-theme-generator': Component = AutoLightThemeGenerator; break;
        case 'clock-with-flash-alerts': Component = FlashClock; break;
        case 'color-blindness-simulator': Component = ColorBlindness; break;
        default: return <div style={{
            display: 'grid',
            placeItems: 'center',
            flex: '1 1 100%',
            color: 'red'
        }}>Tool: "{toolName}" not found! <button onClick={() => navigate('/')}>Return</button></div>
    }

    return (
        <Suspense fallback={<div style={{
            display: 'grid',
            placeItems: 'center',
            flex: '1 1 100%',
            color: 'var(--color-text-high'
        }}>Loading...</div>}>
            <Component />
        </Suspense>
    )
}