import { defineCollection, z } from "astro:content";

export const sectionsCollection = defineCollection({
    type: "data",
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            meetingDay: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
            age: z.string(),
            meetingStartTime: z.string(),
            meetingEndTime: z.string(),
            order: z.number(),
            image: image()
        }),
});

export const collections = {
    sections: sectionsCollection,
};