'use client'
import { useState } from "react"
import classes from "./delete-task-styles.module.css";

// Function to delete a task
function DeleteTaskForm() {
    async function onSubmit() {
    
    // Send a request to the backend to delete the task with the name encoded into the URL
    const res = await fetch(`http://localhost:8080/tasks/${encodeURIComponent(name)}`,{
        method: "DELETE" 
        }
    );}

    // Here we setup a variable for the name of the of the task we want to delete
    const [name, setName] = useState("")


    return (
        <div>
            <h3>Delete Task</h3>
            <div className={classes.mainForm}>
                <div>
                    <label htmlFor="name">Task Name: </label>
                    <input
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
        
                    />
                </div>
            </div>
            <button className={classes.button} onClick={onSubmit}>Submit</button>
            
        </div>
    )
}
export default DeleteTaskForm