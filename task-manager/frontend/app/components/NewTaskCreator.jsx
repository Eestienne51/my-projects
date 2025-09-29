'use client'
import { useState } from "react"
import classes from "./new-task-creator-styles.module.css";

function NewTaskForm() {
    async function onSubmit() {
        // Instead of getting we post it instead
        const newTaskBody = {
            // Takes all data from frontend in one piece for us to then send to the backend
            name,
            description,
            urgency
        }

        // Same as with getting we fetch the adress
        const res = await fetch("http://localhost:8080/tasks", {
            method: "POST",
            // As we're sending we must specify what kind of data we are sending
            headers: {
                "content-type": "application/json"
            },
            // Turns data into something that can be sent over web
            body: JSON.stringify(newTaskBody)
        })

    }
    // NOTE: this is not the best way to collect data, but is good for demo purposes!
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [urgency, setUrgency] = useState("")


    return (
        <div>
            <h3>Add New Task</h3>
            
            <div className={classes.mainForm}>
                <div>
                    <label htmlFor="name">Task Name: </label>
                    <input
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="name">Description: </label>
                    <input
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="name">Urgency: </label>
                    <input
                        value={urgency}
                        onChange={(event) => setUrgency(event.target.value)}
                    />
                </div>
            </div>
            <button className={classes.button} onClick={onSubmit}>Submit</button>
            
        </div>
    )
}
export default NewTaskForm