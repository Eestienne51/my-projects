import { Book } from "../BookListing/BookListing"
import "./BookInfo.css"
import { useEffect, useState } from "react";
import { getUsername } from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import TradeSelectionModal from "../TradeSelectionModal/TradeSelectionModal";

interface bookInfoProps{
    book: Book;
    onClose: () => void;
    trade?: boolean;
    ownTradeProposal? : boolean
}

export default function BookInfo({book, onClose, trade, ownTradeProposal} : bookInfoProps){
    const [displayDelete, setDisplayDelete] = useState<boolean>(false);
    const [displayTradeModal, setDisplayTradeModal] = useState<boolean>(false);

    const currentUser = useAuth();

    useEffect(() => {
        checkIfDeleteBook();
    }, [])



    const checkIfDeleteBook = async () => {
        try {
            const userId = currentUser?.currentUser?.uid;
            let username;

            if (userId) {
                username = await getUsername(userId);
            }

            if (username === book.username) {
                setDisplayDelete(true);
            }

        } catch (error){
            console.error(error, "Error while deleting book")
        }
    }

    const deleteBook = async () => {
        try {
            const response = await api.delete("http://localhost:8080/deleteBookListing", {
                data: {
                    id: book.id
                }
            });

            const deleteEvent = new CustomEvent("bookDeleted");
            window.dispatchEvent(deleteEvent);
            
            console.log("Book listing deleted", response.data)
            onClose();
        } catch (error){
            console.error("Error while deleting book: ", error)
        }
    }

    const onTradeSubmit = (bookOfferedId: string) => {

    }


    return(
        <div>
            <div className="info-background">
                <div className="book-info-popup" onClick={(e) => e.stopPropagation()}>
                    <button className="x-button" onClick={onClose}>
                        x
                    </button>
                    <h2>
                        {book.title}
                    </h2>
                    <p>
                        {book.author}
                    </p>

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

                    {trade ? 
                        <div className="book-actions">
                            {ownTradeProposal ?
                                <button className="request-button">Remove</button>
                                :
                                <button className="accept-button">Accept</button>
                            }
                            {ownTradeProposal ?
                                <button className="close-button" onClick={onClose}>Close</button>
                                :
                                <button className="decline-button">Decline</button>
                            }
                        </div>
                        :
                        <div className="book-actions">
                            {displayDelete ? 
                                <button className="request-button" onClick={() => deleteBook()}>Delete</button> 
                                :
                                <button className="request-button" onClick={() => setDisplayTradeModal(true)}>
                                    Request Trade</button>
                            }
                            <button className="close-button" onClick={onClose}>Close</button>
                        </div>
                    }
                    
            
                </div>
            </div>
            <div>
                {displayTradeModal && (
                    <TradeSelectionModal 
                    requestedBook={book}
                    onClose={() => setDisplayTradeModal(false)}
                    onTradeSubmit={onTradeSubmit}/>
                )}
            </div>
        </div>
    )
   


}