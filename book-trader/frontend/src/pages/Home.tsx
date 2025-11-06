import axios from "axios";
import BookListing from "../components/BookListing/BookListing";
import BookAdder from "../components/BookAdder/BookAdder";
import { useNavigate } from "react-router-dom";

export default function Home(){

    const navigate = useNavigate();

    return(
        <main>
            <div>
                <button onClick={() => navigate("/login")}>
                    Login
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
            <div>
                <h2>
                    Add a book to the listings
                </h2>
                <BookAdder />
            </div>
            
        </main>
    )

}