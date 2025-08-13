import { CustomJwtPayload } from "../middlewares/validateToken";
import user from "../database/user.json";
import book from "../database/book.json";
import review from "../database/review.json"
import path from "node:path";
import fs  from "node:fs";
import { AddReadingListBook, ReviewBookPost } from "../interfaces/types";
import { HttpException } from "../utils/httpException";

const bookDBPath = path.join(__dirname, "../database/book.json");
const reviewDBPath = path.join(__dirname, "../database/review.json");

export class BookModel{
    async findUser(id: string){
        const userExists = user.some((u) => u.id === id)
        if(!userExists) {
            return false
        }

        return true
    }

    async saveToReadingList(id: string, bookData: AddReadingListBook) {
        let userReadingList = book.find((b) => b.id === id);
        if (!userReadingList) {
            
            userReadingList = {
                id: id,
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

    findReadingList (userId: string) {
        const readingList = book.find((b) => b.id === userId);
        return readingList ? readingList["reading-list"] : [];
    }

    createBookPost (bookData: ReviewBookPost){
        fs.writeFileSync(reviewDBPath, JSON.stringify(review, null, 2));

        return bookData
    }
}