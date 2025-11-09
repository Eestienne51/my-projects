import api from "../../api/axios";
import { useEffect, useState } from "react";

interface Book {
    id: string;
    title: string;
    description: string;
    condition: string;
    username: string;
}

export default function BookListing(){
    const [books, setBooks] = useState<Book[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async () => {
        try {
            // setLoading(true);
            const response = await api.get("http://localhost:8080/getAllBookListings");
            console.log(response)

            if (response.data.success === true){
                setBooks(response.data.books);
            } 
        } catch(error){
            console.error(error)
            setError("Error while getting books")
        } finally {
            // setLoading(false);
        }
    }

    useEffect(() => {
        const handleSavedBook = () => {
            fetchBooks();
        }

        window.addEventListener("savedBook", handleSavedBook);

        return () => {
            window.removeEventListener("savedBook", handleSavedBook);
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
                    <th>Description</th>
                    <th>Condition</th>
                    <th>Posted By</th>
                </tr>
            </thead>
            <tbody >
                {books.map((book) =>(
                    <tr key={book.id} onClick={() => alert(book.id)}>
                        <td>{book.title}</td>
                        <td>{book.description}</td>
                        <td>{book.condition}</td>
                        <td>{book.username}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}