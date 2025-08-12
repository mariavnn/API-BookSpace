import { IUserRegister, SearchUser, User, UserUpdate} from "../interfaces/types";
import { AuthModel } from "../models/authModel";
import { randomUUID } from "node:crypto";
import { UserLogin, UserRegister } from "../schemas/authSchema";
import { HttpException } from "../utils/httpException";
import { SALT_ROUNDS } from "../config/config";
import bcrypt from "bcrypt";
import { CustomJwtPayload, SessionRequest } from "../middlewares/validateToken";
import { JwtPayload } from "jsonwebtoken";

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

    myUser = async (data: CustomJwtPayload) => {
        const { username } = data;
        const user = await this.authModel.findUser({ username });
        if(!user) throw new HttpException(404, "User not Found");

        const { name, email, username: uname, age } = user;

        return {
            name,
            email,
            username: uname,
            age
        };
    }

    updateUser = async (data : CustomJwtPayload, body : UserUpdate ) => {
        const { id } = data;
        const { username, email } = body;
        const criteria = { username, email };

        const filteredCriteria = Object.fromEntries(
            Object.entries(criteria).filter(([_, v]) => v != undefined) 
        );

        if (Object.keys(filteredCriteria).length > 0) {
            const findUser = await this.authModel.findUser(filteredCriteria as SearchUser);
            if (findUser) {
                throw new HttpException(400, "User already existed");
            }
        }
        
        const user = await this.authModel.updateUser(id, body );
        if(!user) throw new HttpException(404, "User not Found");

        return user
    }
}