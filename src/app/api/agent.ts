import axios, { AxiosError, AxiosResponse } from "axios";
import { idText } from "typescript";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';

// I set this to true to send cookies with the request
// Temporaly have no use, I guess, but It could be¿?
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

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
}
);

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Login = {
    login: (userId: string, userPassword: string) =>
        requests.post('users/login', {
            id: userId,
            password: userPassword,
        }),
}

const agent = {
    Login,
}

export default agent;