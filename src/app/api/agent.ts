import axios, { AxiosError, AxiosResponse } from "axios";
import { idText } from "typescript";
import User from "../models/User";
import {store} from "../store/store";
import FeedPost from "../models/FeedPost";
import Appointment from "../models/Appointment";
import SpecialistInfo from "../models/SpecialistInfo";
import Specialist from "../models/Specialist";
import ForumPost from "../models/ForumPost";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';

// I set this to true to send cookies with the request
// Temporaly have no use, I guess, but It could be¿?
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token =  store.getState().account.token;
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
    getSpecialists: () =>
        requests.get('Specialists/get-all-specialists'),
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
};

const Forum = {
    createPost: (postData: ForumPost) =>
        requests.post('ForumPosts/create-post', postData),
    getPosts: () =>
        requests.get('ForumPosts/'),



};

const Users = {
    getProfileInformation: () =>
        requests.get('Users/profile-information'),
    updateProfileInformation: (newData: User) =>
        requests.put('Users/profile-information', newData),
};

const Tags = {
    getTags: () =>
        requests.get('Tags'),
};

const Appointments = {
    listByUser: (userId: string) =>
        requests.get(`Appointments/user/${userId}`),
};

const Admin = {
    addSpecialist: (specialist: Specialist) =>
        requests.post(`Admin/create-specialist`,specialist),
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
