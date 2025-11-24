import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useEffect, useState } from "react";
import axios from "axios";
import { Book } from "../components/BookListing/BookListing";
import BookInfo from "../components/BookInfo/BookInfo";

export default function Trades(){
    const [requestedTrades, setRequestedTrades] = useState<any[]>([]);
    const [receivedTrades, setReceivedTrades] = useState<any[]>([]);
    const [showBookInfo, setShowBookInfo] = useState<boolean>(false);
    const [selectedBook, setSelectedBook] = useState<Book>();
    const [ownTradeProposal, setOwnTradeProposal] = useState<boolean>();

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

    const getBooks = async (requestedTradesData: any[], receivedTradesData: any[]) => {
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
                        bookRequested: bookRequested.data.book
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
                        bookRequested: bookRequested.data.book
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

    const handleBookClick = (book: Book, ownTrade: boolean) => {
        setShowBookInfo(true);
        setSelectedBook(book);
        setOwnTradeProposal(ownTrade);
    }

    
    return(
        <div>
            <h2>Trades</h2>
            <h3>Requested Trades</h3>
            <table>
                <thead>
                    <tr>
                        <th>In Exchange For</th>
                        <th>Requesting</th>
                    </tr>
                </thead>
                <tbody>
                    {requestedTrades.map((trade) => (
                        <tr key={trade.id}>
                            <td onClick={() => handleBookClick(trade.bookRequested, true)}>{trade.bookOffered.title}</td>
                            <td onClick={() => handleBookClick(trade.bookOffered, true)}>{trade.bookRequested.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Received Trades</h3>
            <table>
                <thead>
                    <tr>
                        <th>Requesting</th>
                        <th>In Exchange For</th>
                    </tr>
                </thead>
                <tbody>
                    {receivedTrades.map((trade) => (
                        <tr key={trade.id}>
                            <td onClick={() => handleBookClick(trade.bookRequested, false)}>{trade.bookRequested.title}</td>
                            <td onClick={() => handleBookClick(trade.bookOffered, false)}>{trade.bookOffered.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(showBookInfo && selectedBook) && (
                <BookInfo 
                    book={selectedBook} 
                    onClose={() => setShowBookInfo(false)} 
                    trade={true} 
                    ownTradeProposal={ownTradeProposal}/>
            )}
        </div>
    )
}