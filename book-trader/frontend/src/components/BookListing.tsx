import axios from "axios";
import { useEffect, useState } from "react";

interface Book {
    id: string;
    title: string;
    description: string;
    condition: string;
    user: string;
}

export default function BookListing(){
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<String | null>(null)

    useEffect(() =>{
        const fetch = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/getAllBookListings");
                console.log(response)

                if (response.data.result === "success"){
                    setBooks(response.data.books);
                }
            } catch(error){
                console.error(error)
                setError("Error while getting books")
            } finally {
                setLoading(false);
            }
        }
        fetch()
    }, []);

    if (loading) return <p>Loading Books...</p>;
    if (error) return <p style={{color: "red"}}>{error}</p>;
    if (books.length === 0) return <p>There are no books available to trade at this time. Please check back later.</p>;

    return (
        <table>
            <thead>
                
            </thead>
            {books.map((book) => (
                <li key={book.id}>{book.title}</li>
            ))};
        </table>
    )
}