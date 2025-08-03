import { createBrowserRouter } from "react-router-dom";
import App from './App'
import ToolsGrid from "./components/ToolsGrid/ToolsGrid";
import ToolLoader from "./ToolLoader";
import About from "./routes/About/About";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <ToolsGrid />
            },
            {
                path: '/about',
                element: <About />
            },
        ]
    },
    {
        path: '/:toolName',
        element: <ToolLoader />,
    },
])
