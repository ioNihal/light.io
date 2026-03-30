import { createBrowserRouter } from "react-router-dom";
import App from './App'
import ToolsGrid from "./components/ToolsGrid/ToolsGrid";
import ToolLoader from "./ToolLoader";
import About from "./routes/About/About";
import Updates from "./routes/Updates/Updates";

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
            {
                path: '/updates',
                element: <Updates />
            },
            {
                path: '/:toolName',
                element: <ToolLoader />,
            },
        ]
    },

])
