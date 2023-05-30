import LoginPage from "../../features/home/LoginPage";
import App from "../layout/App";
import {createBrowserRouter, Navigate} from "react-router-dom";
import RegisterPage from "../../features/home/RegisterPage";
import RequireAuth from "./RequireAuth";
import Profile from "../../features/account/Profile";
import FeedPostForm from "../../features/feed/FeedPostForm";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Navigate to={"/login"} /> },
            { path: '/login', element: <LoginPage /> },
            { path: '/register', element: <RegisterPage /> },
            { path: '/account', element: <RequireAuth />, children:
            [
                {path: '', element: <Profile />}
            ]},
            { path: '/feed/create', element: <FeedPostForm /> },
        ]
    }]);