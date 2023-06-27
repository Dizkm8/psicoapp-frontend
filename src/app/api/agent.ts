import axios, { AxiosError, AxiosResponse } from "axios";
import { idText } from "typescript";
import User from "../models/User";
import { store } from "../store/store";
import FeedPost from "../models/FeedPost";
import Appointment from "../models/Appointment";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';

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
    get: <T>(url: string): Promise<T> => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}): Promise<T> => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}): Promise<T> => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string): Promise<T> => axios.delete<T>(url).then(responseBody),
};

const Login = {
    login: (userId: string, userPassword: string) =>
        requests.post<any>('Auth/login', {
            id: userId,
            password: userPassword,
        }),
    register: (userData: User) =>
        requests.post<any>('Auth/register-client', {...userData}),
    updatePassword: (passwordForm: any) =>
        requests.put<any>('Auth/update-password', passwordForm),
};

const Specialists = {
    getAvailability: (date: string) =>
        requests.get<any>(`Specialists/availability/${date}`),
    addAvailability: (selection: { startTime: string }[]) =>
        requests.post<any>('Specialists/add-availability', [...selection]),
};

const Feed = {
    createPost: (postData: FeedPost) =>
        requests.post<any>('FeedPosts/create-post', postData),
};

const Users = {
    getProfileInformation: () =>
        requests.get<User>('Users/profile-information'),
    updateProfileInformation: (newData: User) =>
        requests.put<any>('Users/profile-information', newData),
};

const Tags = {
    getTags: () =>
        requests.get<any>('Tags'),
};

const Appointments = {
    getAppointmentsByClient: () =>
        requests.get<Appointment[]>(`Appointments/get-appointments-client`),
    cancelAppointment: (appointmentId: number) =>
        requests.delete(`Appointments/cancel-appointment/${appointmentId}`),
};

const agent = {
    Login,
    Specialists,
    Feed,
    Users,
    Tags,
    Appointments,
};

export default agent;
