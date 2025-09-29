'use client'
import { useEffect, useState } from "react"
import classes from "./tasks-styles.module.css"

function Tasks() {
    // Array of students state
    const [tasks, setTasks] = useState([])
    // A function to get all of the tasks from the frontend
    async function getAllTasks() {
        // await means that we can use res asynchronously
        const res = await fetch("http://localhost:8080/tasks", {
            method: "GET",
        })

        const resJSON = await res.json();
        // Set the tasks to be what we collect from the response
        setTasks(resJSON);
    
    }

    useEffect(() => {
        getAllTasks();
    }, [])

    return (
        <div>
            <h2>Tasks Table</h2>
            <button onClick={getAllTasks}>
                Reload
            </button>
            <br />
            <br />
            <table className={classes.table}>
                <tbody >
                    <tr className={classes.row}>
                        <th className={classes.element}>Name</th>
                        <th className={classes.element}>Description</th>
                        <th className={classes.element}>Urgency</th>
                    </tr>
                    {
                        tasks.map((task) =>
                            <tr key={task.id} className={classes.row}>
                                <td className={classes.element}>{task.name}</td>
                                <td className={classes.element}>{task.description}</td>
                                <td className={classes.element}>{task.urgency}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
export default Tasks;