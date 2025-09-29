import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
dotenv.config()

import { db } from "./util/FirebaseInit.js";
import { collection, getDocs, addDoc, where, query, deleteDoc } from "firebase/firestore"

const app = express()
const port = 8080;

app.use(express.json())
app.use(
	cors({
		origin: "http://localhost:3000"
	})
)
app.use(bodyParser.urlencoded({ extended: false }))

// Create a route at http://localhost:8080/testRoute. You can try it with your browser!
app.get("/", async (req, res) => {
	res.send("Tasks");
});

// Get all the tasks
app.get("/tasks", async (req, res) => {

    console.log("getting all tasks")

	// make an array
    const docs = []

    // get the collection we want
    const collectionRef = collection(db, "tasks");
    
    // get the documents from the collection
    const collectionSnap = await getDocs(collectionRef)

    // Loop through the documents and push the data from each document into our array
    collectionSnap.forEach((doc) => {
		docs.push(doc.data())
	})

    // Send our array
    res.send(docs)
});


// Add a new task
app.post("/tasks", async (req, res) => {

	console.log("adding a tasks")

	// Get all the tasks
	const taskRef = collection(db, "tasks");

	// Set the task body to be the body of the request 
	const taskBody = req.body

	// First try to add the task with the reference and the body given
	try {
		await addDoc(taskRef, taskBody)

	} catch (e) {
		// If adding fails throw an error
		console.error(e)
		res.status(500);
	}
	// Otherwise print that we have successfully created a task
	res.status(200).send("Succesfully Created Task")
})

// Delete an existing Task with the name encoded into the url
app.delete("/tasks/:name", async (req, res) => {

	console.log("deleting a task")

	// Get the task name from the request
	const name = req.params.name; 
  	
	try {
		// Get the reference of the tasks from the database
		const taskRef = collection(db, "tasks");

		// Query the taskRef to try and find the task with the name that we want 
		const q = query(taskRef, where("name", "==", name))

		// Get the data corresponding to the task we want
		const snapshot = await getDocs(q);

		// If docs are empty, send an error
		if (snapshot.empty) {
      		return res.status(404).send("Task not found");
    	}

		// For each document in the snapshot, we delete it from the database
		snapshot.forEach(async doc => {
		await deleteDoc(doc.ref);
		});

    	res.status(200).send("Successfully Deleted Task");

	} catch (e) {
		// If an error arises, we send an error
		console.error(e);
		res.status(500).send("Error deleting task");
	}


})

function start() {
	app.listen(port, () => {
		console.log(`Started listening on http://localhost:${port}`)
	})
}

start()
