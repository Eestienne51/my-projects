import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Trades(){
    const [requestedTrades, setRequestedTrades] = useState<any[]>([]);
    const [receivedTrades, setReceivedTrades] = useState<any[]>([]);

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
                            <td>{trade.bookOffered.title}</td>
                            <td>{trade.bookRequested.title}</td>
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
                            <td>{trade.bookRequested.title}</td>
                            <td>{trade.bookOffered.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}