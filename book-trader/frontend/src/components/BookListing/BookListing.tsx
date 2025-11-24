import api from "../../api/axios";
import { useEffect, useState } from "react";
import "./BookListing.css"

export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    condition: string;
    username: string;
}

interface BookListingProps {
    onBookClick: (book: Book) => void;
}

export default function BookListing({ onBookClick }: BookListingProps){
    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async () => {
        try {
            const response = await api.get("http://localhost:8080/getAllBookListings");
            console.log(response)

            if (response.data.success === true){
                setBooks(response.data.books);
            } 
        } catch(error){
            console.error(error)
            setError("Error while getting books")
        } 
    }

    useEffect(() => {
        const handleSavedBook = () => {
            fetchBooks();
        }

        const handleDeletedBook = () => {
            fetchBooks();
        }

        window.addEventListener("savedBook", handleSavedBook);
        window.addEventListener("bookDeleted", handleDeletedBook);

        return () => {
            window.removeEventListener("savedBook", handleSavedBook);
            window.removeEventListener("bookDeleted", handleDeletedBook);
        }
    }, [])


    useEffect(() =>{
        fetchBooks()
    }, []);

    useEffect(() => {
        console.log("Books array:", books);
    }, [books]);

    // if (loading) return <p>Loading Books...</p>;
    if (error) return <p style={{color: "red"}}>{error}</p>;
    if (books.length === 0) return <p>There are no books available to trade at this time. Please check back later.</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Description</th>
                    <th>Condition</th>
                    <th>Posted By</th>
                </tr>
            </thead>
            <tbody >
                {books.map((book) =>(
                    <tr key={book.id} onClick={() => onBookClick(book)} className="book-listing">
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.description}</td>
                        <td>{book.condition}</td>
                        <td>{book.username}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}