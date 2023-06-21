import LoginPage from "../../features/account/LoginPage";
import HomePage from "../../features/home/HomePage";
import UpdateProfile from "../../features/account/ProfilePage/UpdateProfile";
import App from "../layout/App";
import {createBrowserRouter, Navigate} from "react-router-dom";
import RegisterPage from "../../features/account/RegisterPage";
import RequireAuth from "./RequireAuth";
import ProfilePage from "../../features/account/ProfilePage/ProfilePage";
import CreateFeedPostPage from "../../features/feed/CreateFeedPostPage";
import DefineAvailabilityPage from "../../features/specialist/DefineAvailabilityPage/DefineAvailabilityPage";
import Appointments from "../../features/account/Appointments";
import SelectSpecialistPage from "../../features/client/SelectSpecialistPage";

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
                { path: '', element: <ProfilePage />},
                { path: 'edit', element: <ProfilePage /> },
                { path: 'appointments', element: <Appointments /> },
            ]},
            { path: '/specialist', element: <RequireAuth role={3} />, children:
                    [
                        { path: 'availability', element: <DefineAvailabilityPage />},
                    ]},
            { path: '/feed', element: <RequireAuth role={3} />, children:
                    [
                        {path: 'create', element: <CreateFeedPostPage />}
                    ]},
            { path: '/client', element: <RequireAuth role={2} />, children:
                    [
                        {path: 'select', element: <SelectSpecialistPage />},
                    ]},
            { path: '/home', element: <HomePage /> },
        ]
    }]);