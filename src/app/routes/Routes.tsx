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
import CreateForumPostPage from "../../features/forum/CreateForumPostPage";
import PostDisplayPage from "../../features/forum/PostDisplayPage";
import FeedDisplayPage from "../../features/feed/FeedDisplaypage";
import BookAppointmentPage from "../../features/client/BookAppointmentPage/BookAppointmentPage";
import UserAdministrationPage from "../../features/administrator/UserAdministrationPage/UserAdministrationPage";
import AddSpecialistPage from "../../features/administrator/UserAdministrationPage/AddSpecialistPage";
import AdministratorPage from "../../features/administrator/AdministratorPage";
import UpdateRulesPage from "../../features/administrator/UpdateRulesPage";

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
            { path: '/feed', element: <RequireAuth role={2} />, children:
                    [
                        {path: 'create', element: <CreateFeedPostPage />},
                        {path: '', element: <FeedDisplayPage/>}
                    ]},
            { path: '/forum', element: <RequireAuth role={2} />, children:
                    [
                        {path: 'create', element: <CreateForumPostPage />},
                        {path: '', element: <PostDisplayPage />}
                    ]},
            { path: '/client', element: <RequireAuth role={2} />, children:
                    [
                        {path: 'select', element: <SelectSpecialistPage />},
                        {path: 'select/:id', element: <BookAppointmentPage />},
                    ]},
            { path: '/administrator', element: <RequireAuth role={1} />, children:
                    [
                        {path: '', element: <AdministratorPage />},
                        {path: 'update-rules', element: <UpdateRulesPage />},
                        {path: 'manage-users', element: <UserAdministrationPage />},
                        {path: 'manage-users/add-specialist', element: <AddSpecialistPage />},
                    ]},
            { path: '/home', element: <HomePage /> },
        ]
    }]);