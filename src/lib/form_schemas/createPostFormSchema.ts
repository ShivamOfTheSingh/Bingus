import { z } from "zod";

const createPostSchema = z.object({
    postCaption: z
      .string()
      .min(1, "Caption is required")
      .max(100, "Caption is exceeding 100 characters"),
  
    postFiles: z
      .array(
        z.object({
          name: z.string(),
          size: z.number(),
          type: z.string().refine(
            (type) => ["image/jpeg", "image/png", "video/mp4", "image/gif"].includes(type),
            { message: "Only JPG, PNG, GIF, and MP4 formats are allowed" }
          ),
        })
      )
      .min(1, "At least one file is required")
      .max(5, "You can upload up to 5 files"),
  });

export default createPostSchema;