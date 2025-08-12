import { CustomJwtPayload } from "../middlewares/validateToken";
import user from "../database/user.json";
import book from "../database/book.json";
import path from "node:path";
import fs  from "node:fs";
import { AddReadingListBook } from "../interfaces/types";
import { HttpException } from "../utils/httpException";

const bookDBPath = path.join(__dirname, "../database/book.json");

export class BookModel{
    async saveToReadingList(userId: CustomJwtPayload, bookData: AddReadingListBook) {
        const userExists = user.some((u) => u.id === userId.id) 
         if (!userExists) {
            throw new HttpException(404, "User not found")
        }

        let userReadingList = book.find((b) => b.id === userId.id);
        if (!userReadingList) {
            
            userReadingList = {
                id: userId.id,
                "reading-list": []
            };

            book.push(userReadingList);
        }

        const alreadyAdded = userReadingList["reading-list"].some((b) => b.googleId === bookData.googleId);
        
        if (alreadyAdded) {
            throw new HttpException(409, "Book already existed in reading list");
        }

        const bookToAdd = {
            ...bookData
        }

        userReadingList["reading-list"].push(bookToAdd);

        
        fs.writeFileSync(bookDBPath, JSON.stringify(book, null, 2));

        return bookData;
    }
}