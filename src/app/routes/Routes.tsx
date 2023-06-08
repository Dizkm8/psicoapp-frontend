import LoginPage from "../../features/account/LoginPage";
import HomePage from "../../features/home/HomePage";
import UpdateProfile from "../../features/account/UpdateProfile";
import App from "../layout/App";
import {createBrowserRouter, Navigate} from "react-router-dom";
import RegisterPage from "../../features/account/RegisterPage";
import RequireAuth from "./RequireAuth";
import Profile from "../../features/account/Profile";
import FeedPostForm from "../../features/feed/FeedPostForm";
import DefineAvailability from "../../features/specialist/DefineAvailability";

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
                { path: '', element: <Profile />},
                { path: 'edit', element: <Profile /> },
            ]},
            { path: '/specialist', element: <RequireAuth role={3} />, children:
                    [
                        { path: 'availability', element: <DefineAvailability />},
                    ]},
            { path: '/feed/create', element: <FeedPostForm /> },
            { path: '/home', element: <HomePage /> },
        ]
    }]);