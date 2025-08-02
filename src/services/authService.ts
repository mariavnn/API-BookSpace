import { uuid } from "zod";
import { IUserRegister, User} from "../interfaces/types";
import { AuthModel } from "../models/userModel";
import bcryptjs from "bcryptjs"
import { randomUUID } from "node:crypto";
import { UserRegister } from "../schemas/authSchema";

export class AuthService {
    private authModel : AuthModel
    constructor({authModel} : {authModel : AuthModel}){
        this.authModel = new AuthModel()
    }

    register = async (data: UserRegister) => {
        const { name, email, username, password, age } = data;
        const findUser = await this.authModel.findUnique(data);
        
        
        if(findUser){
            throw new Error("User with this data already existed");
        }

        const hash_password = await bcryptjs.hash(password, 10);
        
        const newUser = await this.authModel.createUser({
            id: randomUUID(),
            name,
            email,
            username,
            age,
            password: hash_password
        })

        return newUser;
    }
}