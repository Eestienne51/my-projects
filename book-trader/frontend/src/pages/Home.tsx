import axios from "axios";
import BookListing from "../components/BookListing/BookListing";
import BookAdder from "../components/BookAdder/BookAdder";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Home(){
    const { currentUser, logout} = useAuth();

    const navigate = useNavigate();

    const handleAuthButton = async () => {
        if (currentUser) {
            await logout();
        }
        else {
            navigate("login");
        }
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
                <BookListing />
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
            
        </main>
    )

}