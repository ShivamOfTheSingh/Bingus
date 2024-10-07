import { z } from 'zod';

const registerUserSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(45, "Username must be at most 45 characters long"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(45, "Email must be at most 45 characters long"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(45, "Password must be at most 45 characters long"),

  passwordRepeat: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(45, "Password must be at most 45 characters long"),

  firstName: z
    .string()
    .min(1, "First name is required")
    .max(45, "First name must be at most 45 characters long"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(45, "Last name must be at most 45 characters long"),

  gender: z
    .enum(["male", "female", "other", "prefer_not_to_say"], {
      errorMap: (issue, ctx) => ({ message: 'Gender is required' })
    }),

  birthdate: z
    .date({
      required_error: "Birth date is required",
      invalid_type_error: "Invalid date format",
    })
})
.refine((data) => data.password === data.passwordRepeat, {
  message: "Passwords must match",
  path: ["passwordRepeat"],
})
.refine((data) => {
  const age = new Date().getFullYear() - data.birthdate.getFullYear();
  const monthDiff = new Date().getMonth() - data.birthdate.getMonth();
  return age > 13 || (age === 13 && monthDiff >= 0);
}, {
  message: "You must be at least 13 years old to register",
  path: ["birthdate"],
});

export default registerUserSchema;