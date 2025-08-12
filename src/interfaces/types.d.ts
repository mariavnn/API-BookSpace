export interface User {
    name: string;
    email: string;
    username: string;
    age: number;
}

export interface IUserRegister{ 
    id: string,
    name: string,
    email: string,
    username: string,
    age: number,
    password: string
}

export interface UserUpdate{
    name?: string,
    email?: string,
    username?: string,
    age?: number,
}

export interface SearchUser{
    email?: string;
    username?: string;
}

interface AddReadingListBook {
  id: string;
  googleId: string;
  title: string;
  subtitle: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
  status: "to-read" | "reading" | "read";
  addedAt: string;
}

