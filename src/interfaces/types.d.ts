export interface User {
    userId: string;
    name: string;
    email: string;
    username: string;
    hash_password: string;
}

export interface IUserRegister{ 
    id: string,
    name: string,
    email: string,
    username: string,
    age: number,
    password: string
}