import { useState } from "react"
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { getUsername } from "../../utils/utils";
import "./BookAdder.css"



export default function BookAdder(){
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [condition, setCondition] = useState<string>("New");
    const [author, setAuthor] = useState<string>("");

    const currentUser = useAuth();

    const handleSubmit = async () => {
        if (!title || !description || !condition || !author){
            alert("Please fill in all fields before submitting!")
            return;
        }

        const userId = currentUser?.currentUser?.uid;

        if (!currentUser || !userId) {
            alert("You must sign-in to add a book listing");
            return;
        }


        try{
            const username = await getUsername(userId);

            if (!username) {
                alert("You must sign-in to add a book listing");
                return; 
            }

            const response = await api.post("http://localhost:8080/addBookListing", {
                title: title,
                author: author,
                description: description,
                condition: condition,
                username: username
            })

            setTitle("");
            setDescription("");
            setAuthor("");
            setCondition("New");

            console.log("Saved Book", response.data)
            const savedEvent = new CustomEvent("savedBook");
            window.dispatchEvent(savedEvent);
        } catch (error: any){
            if (error.status === 401){
                alert("You must sign-in to add a book listing");
            } else {
                console.error("Error while adding book", error);
            }
            
        }
    } 


    return (
        <div className="book-adder-container">
            <div className="book-adder-description">
                <p>
                    Add a book below. Include its title, author, description and condition.
                </p>
            </div>
            <div className="book-adder-form">
                <input 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input 
                    placeholder="Author" 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />

                <input 
                    placeholder="Description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select 
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                >
                    <option value="New">New</option>
                    <option value="Fine">Fine</option>
                    <option value="Near Fine">Near Fine</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>

                </select>

                <button onClick={handleSubmit} className="submit-book-button">Submit</button>
            </div>
        </div>
    )
}
