import LoginPage from "../../features/account/LoginPage";
import HomePage from "../../features/home/HomePage";
import UpdateProfile from "../../features/account/ProfilePage/UpdateProfile";
import App from "../layout/App";
import {createBrowserRouter, Navigate} from "react-router-dom";
import RegisterPage from "../../features/account/RegisterPage";
import RequireAuth from "./RequireAuth";
import Profile from "../../features/account/ProfilePage/ProfilePage";
import CreateFeedPostPage from "../../features/feed/CreateFeedPostPage";
import DefineAvailabilityPage from "../../features/specialist/DefineAvailabilityPage/DefineAvailabilityPage";
import Appointments from "../../features/account/Appointments";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Navigate to={"/home"} /> },
            { path: '/login', element: <LoginPage /> },
            { path: '/register', element: <RegisterPage /> },
            { path: '/account', element: <RequireAuth />, children:
            [
                { path: '', element: <Profile />},
                { path: 'edit', element: <Profile /> },
                { path: 'appointments', element: <Appointments /> },
            ]},
            { path: '/specialist', element: <RequireAuth role={3} />, children:
                    [
                        { path: 'availability', element: <DefineAvailabilityPage />},
                    ]},
            { path: '/feed', element: <RequireAuth role={3} />, children:
                    [
                        {path: 'create', element: <CreateFeedPostPage />}
                    ]
                    },
            { path: '/home', element: <HomePage /> },
        ]
    }]);