import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

const ScreenLight = lazy(() => import('./routes/ScreenLight/ScreenLight'));

export default function ToolLoader() {
    const { toolName } = useParams();
    let Component = null;

    switch (toolName) {
        case 'screen-light': Component = ScreenLight; break;
        default: return <div style={{
            display: 'grid',
            placeItems: 'center',
            flex: '1 1 100%',
            color: 'red'
        }}>Tool: "{toolName}" not found!</div>
    }

    return (
        <Suspense fallback={<div style={{
            display: 'grid',
            placeItems: 'center',
            flex: '1 1 100%',
        }}>Loading...</div>}>
            <Component />
        </Suspense>
    )
}