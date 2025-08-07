import z from "zod";
import { User } from "../interfaces/types";

const createUserSchema = z.object({
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email'),
    username: z.string().nonempty('Username is required').min(3, "Username must be at leat 3 characters long"),
    age: z.number().nonnegative().min(18, "Age must be +18"),    
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
})

const loginSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required"),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type UserRegister = z.infer<typeof createUserSchema>
export type UserLogin = z.infer<typeof loginSchema>

export function validateRegister( object: UserRegister ){
  return createUserSchema.safeParse(object);
}

export function validateLogin ( object: UserLogin){
  return loginSchema.safeParse(object);
}