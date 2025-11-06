import { use, useState } from "react"
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";



export default function BookAdder(){
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [condition, setCondition] = useState<string>("");

    const currentUser = useAuth();

    const handleSubmit = async () => {
        if (!title || !description || !condition){
            alert("Please fill in all fields before submitting!")
            return;
        }

        if (!currentUser) {
            alert("You must be logged in to add a book"); 
            return;
        }

        try{
            const response = await api.post("http://localhost:8080/addBookListing", {
                title: title,
                description: description,
                condition: condition
            })

            setTitle("");
            setDescription("");
            setCondition("");

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
        <div>
        <div>
            <p>
                Add a book below. Include its title, description and condition.
            </p>
        </div>
        <div>
            <input placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            />

            <input 
            placeholder="Description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />

            <input 
            placeholder="Condition" 
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            />
        </div>
        <div>
            <button onClick={ () => {handleSubmit()}}>Submit</button>
        </div>
        </div>
    )
}