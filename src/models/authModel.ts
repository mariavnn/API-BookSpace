import fs from 'fs';
import path from 'path';
import user from "../database/user.json";
import { IUserRegister, SearchUser, User, UserUpdate } from "../interfaces/types";
import { UserLogin, UserRegister } from "../schemas/authSchema";

const userPath = path.resolve(__dirname, '../database/user.json')

export class AuthModel{

    //METODO PARA VER SI UN USUARIO YA EXISTE CON LOS MISMOS DATOS
    async findUser(criteria: SearchUser) {
        return  user.find(u =>
            Object.entries(criteria).every(
                ([key, value]) => u[key as keyof typeof u] === value
            )
        );
    }

    async createUser (data : IUserRegister){
        const {password, ...rest} = data;
        const newUser = {...rest, hash_password: password};
        user.push(newUser);

        fs.writeFileSync(userPath, JSON.stringify(user, null, 2), 'utf-8');
        return rest;
    }

    async updateUser(id: string, data: UserUpdate) {
        const userIndex = user.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return false;
        }

        const existingUser = user[userIndex];
        if (!existingUser) {
            return false
        }


        user[userIndex] = {
            ...existingUser, 
            name: data.name ?? existingUser.name,
            email: data.email ?? existingUser.email,
            username: data.username ?? existingUser.username,
            age: data.age ?? existingUser.age
        };

        const { hash_password, id: _id,  ...userWithoutPassword } = user[userIndex];
        return userWithoutPassword;
    }

}