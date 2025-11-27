import { Book } from "../BookListing/BookListing"
import "./BookInfo.css"
import { useEffect, useState } from "react";
import { getUsername } from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import TradeSelectionModal from "../TradeSelectionModal/TradeSelectionModal";
import { Trade } from "../../pages/Trades";

interface bookInfoProps{
    book: Book;
    onClose: () => void;
    trade?: boolean;
    ownTradeProposal?: boolean;
    tradeDetails?: Trade
}

export default function BookInfo({book, onClose, trade, ownTradeProposal, tradeDetails} : bookInfoProps){
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

            const tradeResponse = await api.delete(`http://localhost:8080/deleteAllTradesForBook?bookId=${book.id}`);

            if (!tradeResponse.data.success){
                alert("Error while deleting trades");
                return;
            }

            const removedTradeEvent = new CustomEvent("tradeRemoved");
            window.dispatchEvent(removedTradeEvent);

            const bookResponse = await api.delete("http://localhost:8080/deleteBookListing", {
                data: {
                    id: book.id
                }
            });

            if (!bookResponse.data.success){
                alert("Error while deleting book");
                return;
            }

            const deleteEvent = new CustomEvent("bookDeleted");
            window.dispatchEvent(deleteEvent);
            
            console.log("Book listing deleted", bookResponse.data)
            onClose();
        } catch (error){
            console.error("Error while deleting book: ", error)
        }
    }

    const onTradeSubmit = async (bookOfferedId: string) => {
        try{
            const response = await api.post("http://localhost:8080/addTrade", {
                accepterId: book.userId, 
                bookRequested: book.id, 
                requesterId: currentUser?.currentUser?.uid, 
                bookOffered: bookOfferedId
                
            });

            if (response.data.success){
                const submittedTradeEvent = new CustomEvent("tradeSubmitted");
                window.dispatchEvent(submittedTradeEvent);
                alert("Trade Saved Successfully!");
                onClose();
            }
        } catch(error){
            console.error("Error while adding trade: ", error)
        }
    }

    const removeTradeOffer = async () => {
        try{
            const response = await api.delete(`http://localhost:8080/deleteTrade/${tradeDetails?.id}`);

            if (response.data.success){
                const removedTradeEvent = new CustomEvent("tradeRemoved");
                window.dispatchEvent(removedTradeEvent);
                alert("Trade Deleted Successfully!")
                onClose();
            }
        } catch(error){
            console.error("Error while removing trade: ", error)
        }
    }

    const updateTrade = async (updatedStatus: string) => {
        try{
            const response = await api.put(`http://localhost:8080/updateTradeStatus/${tradeDetails?.id}`, {
                updatedStatus: updatedStatus
            });

            if (response.data.success){
                const updatedTradeEvent = new CustomEvent("tradeUpdated");
                window.dispatchEvent(updatedTradeEvent);
                alert("Trade updated Successfully!");
                onClose();
            }

        } catch(error){
            console.error("Error while removing trade: ", error)
        }
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
                                <button className="request-button" onClick={() => removeTradeOffer()}>Remove Offer</button>
                                :
                                <button className="accept-button" onClick={() => updateTrade("accepted")}>Accept</button>
                            }
                            {ownTradeProposal ?
                                <button className="close-button" onClick={onClose}>Close</button>
                                :
                                <button className="decline-button" onClick={() => updateTrade("declined")}>Decline</button>
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