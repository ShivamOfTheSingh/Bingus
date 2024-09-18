import { z } from "zod";

export const registerUserSchema = z.object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(45, "Username must be at most 45 characters long"),
    
    email: z
      .string()
      .email("Invalid email format")
      .max(45, "Email must be at most 45 characters long"),
  
    password: z
      .string()
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
      .enum(["male", "female", "other", "prefer_not_to_say"]),
  
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birth date format (YYYY-MM-DD)"),
  });