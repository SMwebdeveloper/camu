import {z} from 'zod'

export const AuthSchema = z.object({
  username: z.string().min(1, "Foydalanuvchi ismi kiritilishi shart"),
  password: z
    .string()
    .min(4, "Password kamida 4 ta belgidan iborat bo‘lishi kerak"),
});