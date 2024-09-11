import { z } from 'zod';

export const registerFormSchema = z.object({
    firstName: z
        .string()
        .min()
});