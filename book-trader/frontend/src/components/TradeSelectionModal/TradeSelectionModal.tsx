import { useEffect, useState } from "react";
import { Book } from "../BookListing/BookListing";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import axios from "axios";
import "./TradeSelectionModal.css";


interface TradeSelectionModalProps{
    requestedBook: Book;
    onClose: () => void;
    onTradeSubmit: (offeredBookId: string) => void;
}


export default function TradeSelectionModal(
    {requestedBook, onClose, onTradeSubmit} : TradeSelectionModalProps){
    const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
    const [bookOfferedId, setBookOfferedId] = useState<string | null>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentUser = useAuth();
    

    const getUserBooks = async () => {
        try {
            setLoading(true);
            const response  = await api.get(`http://localhost:8080/getUserBooks/${currentUser?.currentUser?.uid}`)

            if (!response.data.success){
                throw new Error(response.data.error)
            }

            const books: Book[] = response.data.books;
            console.log(books)

            const booksForTrade = await Promise.all(
                books.map(async (book) => {
                    const response = await axios.get(`http://localhost:8080/getTradesForBook/${book.id}`);

                    if (!response.data.success){
                        throw new Error("Failed to fetch trades")
                    }

                    return {
                        book,
                        isAvailable: !response.data.involvedInTrade
                    }
                })
            );

            const availableBooksOnly = booksForTrade
                .filter(item => item.isAvailable)
                .map(item => item.book);

            console.log(availableBooksOnly);
            setAvailableBooks(availableBooksOnly);


        } catch(error: any){
            console.error("Failed to get available books", error);
            setError(error.message || "Failed to load books");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserBooks();
    }, []) 

    const handleSubmitTrade = () => {
        if (bookOfferedId){
            onTradeSubmit(bookOfferedId);
        }
    }

    const handleCheckboxChange = (bookId: string) => {
        setBookOfferedId(bookOfferedId === bookId ? null : bookId);

    }


    return (
        <div className="trade-options-background">
            <div className="trade-options-popup" onClick={(e) => e.stopPropagation()}>
                <button className="x-button" onClick={onClose}>
                    x
                </button>

                <h3>
                    Book Requested
                </h3>

                <div className="requested-book-container">
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
                            <tr key={requestedBook.id} className="book-listing">
                                <td>{requestedBook.title}</td>
                                <td>{requestedBook.author}</td>
                                <td>{requestedBook.description}</td>
                                <td>{requestedBook.condition}</td>
                                <td>{requestedBook.username}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>
                    Books Available to Trade
                </h3>

                {loading && <p>Loading your books...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && availableBooks.length === 0 && (
                    <p>You don't have any books available to trade.</p>
                )}

                {!loading && !error && availableBooks.length > 0 && (
                    <div className="available-books-container">    
                        <table>
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Book Title</th>
                                    <th>Author</th>
                                    <th>Description</th>
                                    <th>Condition</th>
                                    <th>Posted By</th>
                                </tr>
                            </thead>
                            <tbody className="available-books">
                                {availableBooks.map((book) =>(
                                    <tr key={book.id} className="book-listing">
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                checked={bookOfferedId === book.id}
                                                onChange={() => handleCheckboxChange(book.id)}
                                                className="book-checkbox"
                                            />
                                        </td>
                                        <td>{book.title}</td>
                                        <td>{book.author}</td>
                                        <td>{book.description}</td>
                                        <td>{book.condition}</td>
                                        <td>{book.username}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="modal-actions">
                    <button 
                        onClick={handleSubmitTrade} 
                        disabled={!bookOfferedId}
                        className="confirm-button"
                    >
                        Submit
                    </button>
                    <button onClick={onClose} className="cancel-button">
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    )
}