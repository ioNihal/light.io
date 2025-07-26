import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

const ScreenLight = lazy(() => import('./routes/ScreenLight/ScreenLight'));

export default function ToolLoader() {
    const { toolName } = useParams();
    let Component = null;

    switch (toolName) {
        case 'screen-light': Component = ScreenLight; break;
        default: return <h1>Tool: "{toolName}" not found!</h1>
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component />
        </Suspense>
    )
}