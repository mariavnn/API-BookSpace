import fs from 'fs';
import path from 'path';
import user from "../database/user.json";
import { IUserRegister } from "../interfaces/types";
import { UserRegister } from "../schemas/authSchema";

const userPath = path.resolve(__dirname, '../database/user.json')

export class AuthModel{

    //METODO PARA VER SI UN USUARIO YA EXISTE CON LOS MISMOS DATOS
    async findUnique (data : UserRegister) {
        const { email , username} = data;
        const existingEmail = user.filter((data) => data.email === email);
        const existingUsername = user.filter((data) => data.username === username);

        if(existingEmail.length > 0 || existingUsername.length > 0){
            return true;
        }
        return false;
    }

    async createUser (data : IUserRegister){
        const {password, ...rest} = data;
        const newUser = {...rest, hash_password: password};
        user.push(newUser);

        fs.writeFileSync(userPath, JSON.stringify(user, null, 2), 'utf-8');
        return rest;
    }
}