import user from "../database/user.json";
import { IUserRegister } from "../interfaces/types";
import { UserRegister } from "../schemas/authSchema";

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
        user.push({...rest, hash_password: password});

        return rest;
    }
}