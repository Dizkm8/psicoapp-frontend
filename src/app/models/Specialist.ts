export default interface Specialist {
    name: string;
    firstLastName: string;
    secondLastName: string;
    id: string;
    email: string;
    gender: string;
    phone: number;
    password?: string;
    specialityId: number;
};