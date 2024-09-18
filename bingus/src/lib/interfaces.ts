export interface User {
    userId?: number;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    about: string;
    dateRegistered: string;
    profilePicutre?: Blob;
}