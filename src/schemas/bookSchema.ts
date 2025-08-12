import { title } from "process";
import { z } from "zod";

const addBookToReadingList = z.object({
  googleId: z.string().nonempty("Google Id is required"),
  volumenInfo: z.object({
    title: z.string().nonempty("Title is required"),
    subtitle: z.string(),
    authors: z.array(z.string()).nonempty("Must have at least one author"),
    publisher: z.string(),
    publishedDate: z.string(),
    description: z.string(),
    imageLinks: z.object({
      smallThumbnail: z.string().url(),
      thumbnail: z.string().url(),
    }),
  }),
});


export type ReadingListBook = z.infer<typeof addBookToReadingList>;

export function validateReadingListBook(object: ReadingListBook){
    return addBookToReadingList.safeParse(object);
}