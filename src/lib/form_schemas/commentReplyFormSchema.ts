import { z } from "zod";

const commentReplyFormSchema = z.object({
    reply: z.string().min(1, "Reply cannot be empty").max(100, "Reply cannot exceed 100 characters")
});
export default commentReplyFormSchema;