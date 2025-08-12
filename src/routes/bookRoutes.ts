import { Router } from "express"
import { requireSession } from "../middlewares/requireSession";
import { BookController } from "../controllers/bookController";
import { BookService } from "../services/bookService";
import { BookModel } from "../models/bookModel";

export const bookRoutes = ({bookModel} : {bookModel: BookModel}) => {
    const bookRouter = Router();

    const bookService = new BookService({bookModel});
    const bookController = new BookController({bookService});
    

    bookRouter.get('/search', requireSession, bookController.searchBook) //Route para buscar libros usando Google API

    bookRouter.post('/add-reading-list', requireSession, bookController.addBookToReadingList) //Route para agregar libros a la lista de lectura

    return bookRouter;
}