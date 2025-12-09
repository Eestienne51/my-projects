import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useEffect, useState } from "react";
import axios from "axios";
import { Book } from "../components/BookListing/BookListing";
import BookInfo from "../components/BookInfo/BookInfo";
import Header from "../components/Header/Header";
import "./Trades.css";

export interface Trade{
    id: string,
    bookOffered: Book,
    bookRequested: Book,
    status: string
}

export default function Trades(){
    const [requestedTrades, setRequestedTrades] = useState<Trade[]>([]);
    const [receivedTrades, setReceivedTrades] = useState<Trade[]>([]);
    const [showBookInfo, setShowBookInfo] = useState<boolean>(false);
    const [selectedBook, setSelectedBook] = useState<Book>();
    const [ownTradeProposal, setOwnTradeProposal] = useState<boolean>();
    const [clickedTrade, setClickedTrade] = useState<Trade>();

    const currentUser = useAuth();

    const getTrades = async () => {
        try{
            const userId = currentUser?.currentUser?.uid;

            if (!userId){
                console.error("User is not logged in");
                return;
            }

            const response = await api.get(`http://localhost:8080/getTradesForUser?userId=${userId}`);


            if (response.data.success){
                setRequestedTrades(response.data.requestedTrades);
                setReceivedTrades(response.data.receivedTrades);
                await getBooks(response.data.requestedTrades, response.data.receivedTrades);
            }

        } catch (error){
            console.error("Error while fetching trades", error);
        }
    }

    const getBooks = async (requestedTradesData: Trade[], receivedTradesData: Trade[]) => {
        try {


            const receivedTradesWithBooks = await Promise.all(
                receivedTradesData.map(async (trade) => {
                    const [bookOffered, bookRequested] = await Promise.all([
                        axios.get(`http://localhost:8080/getBookById?bookId=${trade.bookOffered}`),
                        axios.get(`http://localhost:8080/getBookById?bookId=${trade.bookRequested}`)
                    ])
                    if (!bookOffered.data.success || !bookRequested.data.success){
                        throw new Error("Failed to fetch books");
                    }

                    return {
                        id: trade.id,
                        bookOffered: bookOffered.data.book,
                        bookRequested: bookRequested.data.book,
                        status: trade.status
                    }
                })
            );

    
            const requestedTradesWithBooks = await Promise.all(
                requestedTradesData.map(async (trade) => {
                    const [bookOffered, bookRequested] = await Promise.all([
                        axios.get(`http://localhost:8080/getBookById?bookId=${trade.bookOffered}`),
                        axios.get(`http://localhost:8080/getBookById?bookId=${trade.bookRequested}`)
                    ])
                    if (!bookOffered.data.success || !bookRequested.data.success){
                        throw new Error("Failed to fetch books");
                    }

                    return {
                        id: trade.id,
                        bookOffered: bookOffered.data.book, 
                        bookRequested: bookRequested.data.book,
                        status: trade.status
                    };


                })
            );
            

            setRequestedTrades(requestedTradesWithBooks);
            setReceivedTrades(receivedTradesWithBooks);

        } catch(error){
            console.error("Error while fetching books", error);
        }
    }

    useEffect(() => {
        getTrades();
    }, [])

    const handleBookClick = (book: Book, ownTrade: boolean, trade: Trade) => {
        setShowBookInfo(true);
        setSelectedBook(book);
        setOwnTradeProposal(ownTrade);
        setClickedTrade(trade);
    }

    useEffect(() => {
        const handleChangedTrade = () => {
            getTrades();
        }

        window.addEventListener("tradeSubmitted", handleChangedTrade);
        window.addEventListener("tradeRemoved", handleChangedTrade);
        window.addEventListener("tradeUpdated", handleChangedTrade);
        

        return () => {
            window.removeEventListener("tradeSubmitted", handleChangedTrade);
            window.removeEventListener("tradeRemoved", handleChangedTrade);
            window.removeEventListener("tradeUpdated", handleChangedTrade);
        }
    }, [])

    
    return(
        <div className="trades-page">
            <Header trades={true} showLogin={true}/>
            <div className="trades-container">
                <div className="trades-header">
                    <h2>My Trades</h2>
                </div>
                <div className="trades-section">
                    <h3>Requested Trades</h3>
                    {requestedTrades.length === 0 ? (
                        <div className="no-trades">
                            <p>You haven't requested any trades</p>
                        </div>
                    ) : (

                        <table className="trades-table">
                            <thead>
                                <tr>
                                    <th>Offering</th>
                                    <th>Requesting</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requestedTrades.map((trade) => (
                                    <tr key={trade.id}>
                                        <td 
                                            onClick={() => handleBookClick(trade.bookOffered, true, trade)}
                                            className="clickable-cell"
                                        >
                                            {trade.bookOffered.title}
                                        </td>
                                        <td 
                                            onClick={() => handleBookClick(trade.bookRequested, true, trade)}
                                            className="clickable-cell"
                                        >
                                            {trade.bookRequested.title}
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${trade.status.toLowerCase()}`}>
                                                {trade.status}
                                            </span>    
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>


                <div className="trades-section">
                    <h3>Received Trades</h3>
                    {receivedTrades.length === 0 ? (
                        <div className="no-trades">
                            <p>You haven't received any trade requests yet.</p>
                        </div>
                    ) :(
                    <table className="trades-table">
                        <thead>
                            <tr>
                                <th>They are Requesting</th>
                                <th>They are Offering</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receivedTrades.map((trade) => (
                                <tr key={trade.id}>
                                    <td 
                                        onClick={() => handleBookClick(trade.bookRequested, false, trade)}
                                        className="clickable-cell"
                                    >
                                        {trade.bookRequested.title}
                                    </td>
                                    <td 
                                        onClick={() => handleBookClick(trade.bookOffered, false, trade)}
                                        className="clickable-cell"
                                    > 
                                        {trade.bookOffered.title}
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${trade.status.toLowerCase()}`}>
                                            {trade.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}

                    {(showBookInfo && selectedBook) && (
                        <BookInfo 
                            book={selectedBook} 
                            onClose={() => setShowBookInfo(false)} 
                            trade={true} 
                            ownTradeProposal={ownTradeProposal}
                            tradeDetails={clickedTrade}/>
                    )}
                
                </div>
            </div>
        </div>
    )
}