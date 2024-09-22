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
  
    passwordRepeat: z
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
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birth date format (YYYY-MM-DD)")
      .refine((date) => {
        const [year, month, day] = date.split('-').map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        
        // Check if the date is valid (no impossible dates like Feb 30)
        if (inputDate.getFullYear() !== year || inputDate.getMonth() !== month - 1 || inputDate.getDate() !== day) {
          return false;
        }
  
        // Check for reasonable age range (e.g., between 18 and 120 years old)
        const age = today.getFullYear() - year;
        if (age < 18 || age > 120) {
          return false;
        }
  
        // Ensure the date is not in the future
        if (inputDate > today) {
          return false;
        }
  
        return true;
      }, { message: "Invalid or unrealistic birth date" }),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Passwords must match",
    path: ["passwordRepeat"], // This will show the error under passwordRepeat field
  });