import { Book } from "../BookListing/BookListing"
import "./BookInfo.css"

interface bookInfoProps{
    book: Book;
    onClose: () => void;
}

export default function BookInfo({book, onClose} : bookInfoProps){


    return(
        <div className="info-background">
            <div className="book-info-popup" onClick={(e) => e.stopPropagation()}>
                <button className="x-button" onClick={onClose}>
                    x
                </button>
                <h2>
                {book.title}
                </h2>

                <div className="book-details">
                    <div className="detail">
                        <h3>Description</h3>
                        <p>{book.description}</p>
                    </div>

                    <div className="detail">
                        <h3>Condition</h3>
                        <p>{book.condition}</p>                        
                    </div>

                    <div className="detail">
                        <h3>Username</h3>
                        <p>{book.username}</p>                        
                    </div>
                </div>

                <div className="book-actions">
                    <button className="request-button">Request to Trade</button>
                    <button className="close-button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>

    )


}