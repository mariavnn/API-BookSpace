import z from "zod";

export const createUserSchema = z.object({
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email'),
    username: z.string().nonempty('Username is required'),
    age: z.number().nonnegative().min(18, "Age must be +18"),    
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
})

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password is required'),
});