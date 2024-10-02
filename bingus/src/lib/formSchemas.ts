import { z } from 'zod';

export const registerUserSchema = z.object({
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

export const loginUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),

  password: z
    .string()
    .min(1, "Password is required")
});

//Schema for creating posts
export const createPostSchema = z.object({
  postCaption: z
    .string()
    .min(1, "Caption is required")
    .max(100, "Caption is exceeding 100 characters"),
    
    postFile: z
    .array(z.instanceof(File)) // Expect an array of File objects
    .min(1, "At least one file is required")
    .max(5, "You can upload up to 5 files")
    .refine(
      (files) => files.every((file) => ["image/jpeg", "image/png", "video/mp4", "image/gif"].includes(file.type)),
      {
        message: "Only JPG, PNG, GIF, and MP4 formats are allowed",
      }
    ),
})
