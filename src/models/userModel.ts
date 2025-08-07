import fs from 'fs';
import path from 'path';
import user from "../database/user.json";
import { IUserRegister, SearchUser } from "../interfaces/types";
import { UserLogin, UserRegister } from "../schemas/authSchema";

const userPath = path.resolve(__dirname, '../database/user.json')

export class AuthModel{

    //METODO PARA VER SI UN USUARIO YA EXISTE CON LOS MISMOS DATOS
    async findUser(criteria: SearchUser) {
        return user.find(u =>
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
}