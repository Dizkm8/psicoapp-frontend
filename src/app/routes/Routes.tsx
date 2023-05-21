import LoginPage from "../../features/home/LoginPage";
import App from "../layout/App";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <LoginPage /> },
        ]
    }]);