import BookListing from "../components/BookListing/BookListing";
import BookAdder from "../components/BookAdder/BookAdder";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Book } from "../components/BookListing/BookListing";
import BookInfo from "../components/BookInfo/BookInfo";
import Header from "../components/Header/Header";
import "./Home.css";

export default function Home(){
    const { currentUser, logout} = useAuth();
    const [selectedBook, setSelectedBook] = useState<Book>();
    const [showBookInfo, setShowBookInfo] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setShowBookInfo(true);
    }

    const handleCloseInfo = () => {
        setShowBookInfo(false);
    }

    return(
        <>
            <Header home={true} showLogin={true}/>
            <main className="home-container">
                <div className={`content-wrapper ${!currentUser ? 'full-width' : ''}`}>
                    <div className={`listings-section ${!currentUser ? 'full-width' : ''}`}>
                        <div className="home-header">
                            <h1>
                                Home
                            </h1>
                            <p>
                                Explore all the books available to trade below
                            </p>
                        </div>
                        <h2>
                            Book listings
                        </h2>
                        <BookListing onBookClick={handleBookClick}/>
                    </div>

                    { currentUser && ( 
                        <div className="adder-section">
                            <h2>
                                Add a book to the listings
                            </h2>
                            <BookAdder />
                        </div>
                    )}
                </div>

                {!currentUser && (
                    <div className="login-prompt">
                        <p>Please login to add a book</p>
                    </div>
                )}

                {(showBookInfo && selectedBook) && (
                    <BookInfo book={selectedBook} onClose={handleCloseInfo}/>
                )}

                <button
                    className="settings-btn"
                    onClick={() => handleUserAgreement()}
                    aria-label="Access settings"
                >
                    i
                </button>
                
                
            </main>
        </>
    )

}