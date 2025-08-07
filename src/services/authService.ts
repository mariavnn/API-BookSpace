import { IUserRegister, User} from "../interfaces/types";
import { AuthModel } from "../models/userModel";
import { randomUUID } from "node:crypto";
import { UserLogin, UserRegister } from "../schemas/authSchema";
import { HttpException } from "../utils/httpException";
import { SALT_ROUNDS } from "../config/config";
import bcrypt from "bcrypt";

export class AuthService {
    private authModel : AuthModel
    constructor({authModel} : {authModel : AuthModel}){
        this.authModel = new AuthModel()
    }

    register = async (data: UserRegister) => {
        const { name, email, username, password, age } = data;
        const findUser = await this.authModel.findUser({ username, email })
        
        if(findUser){
            throw new HttpException(400, "User already existed");
        }

        const hash_password = await bcrypt.hash(password, SALT_ROUNDS);
        
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

    login = async (data: UserLogin) => {
        const { username, password } = data;
        
        const user = await this.authModel.findUser({ username })
        if(!user) throw new HttpException(404, "User not found");

        const isValid = await bcrypt.compare(password, user.hash_password);
        if(!isValid) throw new HttpException(401, "Incorrect password");

        return user
    }
}