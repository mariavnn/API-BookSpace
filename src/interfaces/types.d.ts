export interface User {
    name: string;
    email: string;
    username: string;
    age: number;
}

export interface IUserRegister{ 
    id: string,
    name: string,
    email: string,
    username: string,
    age: number,
    password: string
}

export interface UserUpdate{
    name?: string,
    email?: string,
    username?: string,
    age?: number,
}

export interface SearchUser{
    email?: string;
    username?: string;
}
