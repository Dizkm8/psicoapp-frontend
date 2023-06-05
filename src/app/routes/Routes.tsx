import LoginPage from "../../features/home/LoginPage";
import HomePage from "../../features/home/HomePage";
import UpdateProfile from "../../features/home/UpdateProfile";
import App from "../layout/App";
import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../../features/home/RegisterPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <LoginPage /> },
            { path: '/register', element: <RegisterPage /> },










            
            { path: '/home', element: <HomePage /> },
            { path: '/UpdateProfile', element: <UpdateProfile /> },

        ]
    }]);