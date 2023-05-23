export default interface User {
    name?: string;
    firstLastName?: string;
    firstSecondName?: string;
    rut?: string;
    email?: string;
    gender?: string;
    phone?: number;
    isEnabled: boolean;
    password?: string;
    type: number;
}