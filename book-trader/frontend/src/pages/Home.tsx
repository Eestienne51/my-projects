import axios from "axios";
import BookListing from "../components/BookListing";


export default function Home(){



    return(
        <main>
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
            
        </main>
    )

}