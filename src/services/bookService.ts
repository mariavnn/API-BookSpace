import axios from "axios";
import { GOOGLE_BOOK_API_KEY } from "../config/config";
import { randomUUID } from "node:crypto";
import { BookModel } from "../models/bookModel";
import { CustomJwtPayload } from "../middlewares/validateToken";
import { ReviewBook } from "../schemas/bookSchema";
import { AddReadingListBook, ReviewBookPost } from "../interfaces/types";
import { HttpException } from "../utils/httpException";

export class BookService{
    private bookModel : BookModel
    constructor({bookModel} : {bookModel : BookModel}){
        this.bookModel = new BookModel()
    }

    async searchBooks(query: string, maxResults: number = 10, startIndex: number = 0) {
        const response = await axios.get(
            "https://www.googleapis.com/books/v1/volumes",
            {
                params: {
                    q: query,
                    maxResults,
                    startIndex,
                    key: GOOGLE_BOOK_API_KEY
                }
            }
        );

        return {
            total: response.data.totalItems,
            books: response.data.items
        };
    }

    async getReadingList(userId: CustomJwtPayload){
        const { id } = userId;
        const readingList = await this.bookModel.findReadingList(id);
        if(!readingList) throw new HttpException(404, "Reading list not found");

        return readingList;
    }

    async addBookToReadingList (userId: CustomJwtPayload, googleId: string, volumenInfo: any){
        const { id } = userId;

        const user = await this.bookModel.findUser(id);
        if(!user) throw new HttpException(404, "User not found in reading list");

        const bookData : AddReadingListBook = {
            id: randomUUID(),
            googleId,
            title: volumenInfo.title,
            subtitle: volumenInfo.subtitle,
            authors: volumenInfo.authors,
            publisher: volumenInfo.publisher,
            publishedDate: volumenInfo.publishedDate,
            description: volumenInfo.description,
            imageLinks: volumenInfo.imageLinks,
            status: "to-read",
            addedAt: new Date().toISOString(),
        }

        return this.bookModel.saveToReadingList(id, bookData);
    }

    async createBookPost (userId: CustomJwtPayload, bookData: ReviewBook){
        const { id } = userId;
         
        const user = await this.bookModel.findUser(id);
        if(!user) throw new HttpException(404, "User not found in reading list");

        const newPost ={
            id: randomUUID(),
            userId: id,
            review: bookData.review,
            bookInfo:{
                googleId: bookData.googleId,
                volumenInfo:{
                    title: bookData.volumenInfo.title,
                    subtitle: bookData.volumenInfo.subtitle,
                    authors: bookData.volumenInfo.authors,
                    publisher: bookData.volumenInfo.publisher,
                    publishedDate: bookData.volumenInfo.publishedDate,
                    description: bookData.volumenInfo.description,
                    imageLinks: bookData.volumenInfo.imageLinks


                }
            },
            createdAt: new Date().toISOString(),
        }

        return this.bookModel.createBookPost(newPost as ReviewBookPost);
    }
}