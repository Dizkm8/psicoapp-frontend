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
import FeedDisplayPage from "../../features/feed/FeedDisplaypage";
import ForumDisplayPage from "../../features/forum/ForumDisplayPage";
import BookAppointmentPage from "../../features/client/BookAppointmentPage/BookAppointmentPage";
import UserAdministrationPage from "../../features/administrator/UserAdministrationPage/UserAdministrationPage";
import AddSpecialistPage from "../../features/administrator/UserAdministrationPage/AddSpecialistPage";
import AdministratorPage from "../../features/administrator/AdministratorPage";
import UpdateRulesPage from "../../features/administrator/UpdateRulesPage";
import AppointmentManagementPage from "../../features/administrator/AppointmentManagementPage";
import SpecialistAppointmentManagementPage from "../../features/administrator/SpecialistAppointmentManagementPage";
import ForumPostDisplayer from "../../features/forum/ForumPostDisplayer";
import FeedPostDisplayer from "../../features/feed/FeedPostDisplayer";
import { idText } from "typescript";

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
            { path: '/feed', element: <RequireAuth/>, children:
                [
                    { path: 'create', element: <RequireAuth role={[1,3]} />, children:
                        [
                            {path: '', element: <CreateForumPostPage />},
                        ]},
                    
                    {path: '', element: <FeedDisplayPage/>},
                    {path: 'post/:id', element: <FeedPostDisplayer/>}
                ]},
            { path: '/forum', element: <RequireAuth />, children:
                [
                    {path: 'create', element: <CreateForumPostPage />},
                    {path: '', element: <ForumDisplayPage />},
                    {path: 'post/:id', element: <ForumPostDisplayer/>}
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
                    {path: 'manage-appointments', element: <AppointmentManagementPage />},
                    {path: 'manage-appointments/:id', element: <SpecialistAppointmentManagementPage />},
                ]},
            { path: '/home', element: <FeedDisplayPage /> },
        ]
    }]);