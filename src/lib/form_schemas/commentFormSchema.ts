import { z } from "zod";

const commentFormSchema = z.object({
    comment: z.string().min(1, "Comment cannot be empty").max(100, "Comment cannot exceed 100 characters")
});
export default commentFormSchema;