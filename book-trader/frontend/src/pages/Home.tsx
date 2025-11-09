import BookListing from "../components/BookListing/BookListing";
import BookAdder from "../components/BookAdder/BookAdder";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Book } from "../components/BookListing/BookListing";
import BookInfo from "../components/BookInfo/BookInfo";

export default function Home(){
    const { currentUser, logout} = useAuth();
    const [selectedBook, setSelectedBook] = useState<Book>();
    const [showBookInfo, setShowBookInfo] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleAuthButton = async () => {
        if (currentUser) {
            await logout();
        }
        else {
            navigate("login");
        }
    }

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setShowBookInfo(true);
    }

    const handleCloseInfo = () => {
        setShowBookInfo(false);
    }

    return(
        <main>
            <div>
                <button onClick={() => handleAuthButton()}>
                    {currentUser ? "Logout" : "Login"}
                </button>
            </div>
            <div>
                <h1>
                    Home
                </h1>
                <p>
                    Explore all the books available to trade below
                </p>
            </div>
            <div>
                <h2>
                    Book listings
                </h2>
                <BookListing onBookClick={handleBookClick}/>
            </div>
                { currentUser ? 
                <div>
                    <h2>
                        Add a book to the listings
                    </h2>
                    <BookAdder />
                </div>
                : 
                <div>
                    <p>Please login to add a book</p>
                </div>}

            {(showBookInfo && selectedBook) && (
                <BookInfo book={selectedBook} onClose={handleCloseInfo}/>
            )}
            
        </main>
    )

}