import { z } from "zod";

const profileSettingsFormSchema = z.object({
    profilePicture: z.optional(z.object({
        name: z.string(),
        size: z.number(),
        type: z.string().refine(
            (type) => ["image/jpeg", "image/png", "video/mp4", "image/gif"].includes(type),
            { message: "Only JPG, PNG, GIF, and MP4 formats are allowed" }
            ),
        })),
    gender: z
        .enum(["male", "female", "other", "prefer_not_to_say"], {
          errorMap: (issue, ctx) => ({ message: 'Gender is required' })
        }),
    about: z.string(),
    showName: z.boolean(),
    profilePublic: z.boolean()
});

export default profileSettingsFormSchema;