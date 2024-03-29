import axios, { AxiosError, AxiosResponse } from "axios";
import User from "../models/User";
import {store} from "../store/store";
import FeedPost from "../models/FeedPost";
import Specialist from "../models/Specialist";
import ForumPost from "../models/ForumPost";
import AddComment from "../models/AddComment";

const sleep = () => new Promise(resolve => setTimeout(resolve, 0));

const serverAddress = 'localhost';
axios.defaults.baseURL = `http://${serverAddress}:5000/api/`;

// I set this to true to send cookies with the request
// Temporaly have no use, I guess, but It could be¿?
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.token;
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
});

axios.interceptors.response.use(async response => {
    // I set a timeout here to simulate a delay in the server response
    // to manage the loading indicator
    await sleep();
    return response;
}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
        case 400: // Usally with modelState with errors array
            break;
        case 401: // Unauthorized
            break;
        case 500: // Server error
            break;
        default: // Other errors
            break;
    }
    return Promise.reject(error.response);
});

const requests = {
    get: (url: string, config?: {}) => axios.get(url, config).then(responseBody),
    post: (url: string, body: {}, config?: {}) => axios.post(url, body, config).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
};

const Login = {
    login: (userId: string, userPassword: string) =>
        requests.post('Auth/login', {
            id: userId,
            password: userPassword,
        }),
    register: (userData: User) =>
        requests.post('Auth/register-client', {...userData}),
    updatePassword: (passwordForm: any) =>
        requests.put('Auth/update-password', passwordForm),
};

const Specialists = {
    getAvailability: (id: string) =>
        requests.get(`Specialists/availability/${id}`),
    addAvailability: (selection: {startTime: string}[]) =>
        requests.post('Specialists/add-availability', [...selection]),
    getSpecialities: () =>
        requests.get('Specialists/get-specialities'),
};

const Clients = {
    addAppointment: (specialistId: string, startTime: string) =>
        requests.post(`Clients/add-appointment/${specialistId}`, {}, {params: {dateTime: startTime}}),
};

const Feed = {
    createPost: (postData: FeedPost) =>
        requests.post('FeedPosts/create-post', postData),
    getPosts: () =>
        requests.get('FeedPosts/'),
    getPost: (postId: number) =>
        requests.get(`FeedPosts/get-post/${postId}`),
    deletePost: (postId: number) =>
        requests.delete(`FeedPosts/delete-post/${postId}`),
};

const Forum = {
    createPost: (postData: ForumPost) =>
        requests.post('ForumPosts/create-post', postData),

    addComment: (postData: AddComment, postId: number) =>
        requests.post(`ForumPosts/add-comment/${postId}`,postData),

    getPosts: () =>
        requests.get('ForumPosts/'),

    getPost: (postId: number) =>
        requests.get(`ForumPosts/get-post/${postId}`),

    deletePost: (postId: number) =>
        requests.delete(`ForumPosts/delete-post/${postId}`),

    deleteComment: (postId: number, CommentId: number) =>
        requests.delete(`ForumPosts/delete-comment/${postId}/${CommentId}`),

    

};

const Users = {
    getProfileInformation: () =>
        requests.get('Users/profile-information'),
    updateProfileInformation: (newData: User) =>
        requests.put('Users/profile-information', newData),
    getSpecialists: () =>
        requests.get('Users/get-all-specialists'),
    getSpecialist: (userId: string) =>
        requests.get(`Users/get-specialist/${userId}`),
    getUsers: () =>
        requests.get('Users'),
};

const Tags = {
    getTags: () =>
        requests.get('Tags'),
};

const Appointments = {
    listByUser: (userId: string) =>
        requests.get(`Appointments/user/${userId}`),
    getAppointmentsByClient: () =>
        requests.get(`Appointments/get-appointments-client`),
    getAppointmentsBySpecialist: () =>
        requests.get(`Appointments/get-appointments-specialist`),
    getSpecialistAppointments: (specialistId: string) =>
        requests.get(`Appointments/get-appointments-specialist/${specialistId}`),
    cancelAppointment: (appointmentId: number) =>
        requests.delete(`Appointments/cancel-appointment/${appointmentId}`),
    getStatistics: () =>
        requests.get('Appointments/get-statistics'),
};

const Admin = {
    getRule: () =>
        requests.get('Admin/'),
    updateRule: (newRule: string) =>
        requests.post('Admin/update-rules', {}, {params: {rules: newRule}}),
    addSpecialist: (specialist: Specialist) =>
        requests.post(`Admin/create-specialist`,specialist),
    updateUserAvailability: (userId: string, isEnabled: boolean) =>
        requests.post(`Admin/update-user-availability/${userId}`, {}, {params: {isEnabled: isEnabled}}),
};

const agent = {
    Login,
    Specialists,
    Clients,
    Feed,
    Users,
    Tags,
    Appointments,
    Forum,
    Admin,
};

export default agent;
