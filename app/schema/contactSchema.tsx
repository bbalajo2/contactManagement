import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
        .regex(/^[a-zA-Z\s]*$/, { message: "Name should only contain letters and spaces" }),
    email: z.string()
        .email({ message: "Invalid email format" }),
    phoneNumber: z.string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .regex(/^[0-9]*$/, { message: "Phone number vaild phone number" }),
    address: z.string().optional(),
});