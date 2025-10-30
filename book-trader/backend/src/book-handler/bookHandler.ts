import { Express } from "express";
import { Request, Response } from "express";
import { firestore } from "../firebase/firebasesetup";
import { error } from "console";


export function registerBookHandler(app: Express){
    app.get("/getAllBookListings", async (req: Request, res: Response) => {

        try{
            const booksQuery = firestore.collection("books");

            const allBooks = await booksQuery.get();

            let books: any[] = []
            allBooks.forEach((doc) => {
                books.push({id: doc.id, ...doc.data()});
            });

            return res.status(200).json({
                result: "success",
                books: books
            });

        }
        catch(error){
            console.error("Failed to get books:", error);
            res.status(500).json({ error: "Server error while getting books." });
        }

    
    })

    app.post("/addBookListing", async (req: Request, res: Response) => {
        try{
            const { title, description, condition, user } = req.body;
            
            if (!title || !description || !condition){
                return res.status(400).json({result: "error", error: "Missing fields"})
            }

            const docRef = await firestore.collection("books").add({
                title,
                description,
                condition,
                user
            });
            
            return res.status(200).json({
                result: "success",
                message: "Book saved successfully",
                bookId: docRef.id
            })
        } catch (error){
            console.error("Failed to save book", error);
            return res.status(500).json({
                result: "error",
                error: "Error while saving the book"
            })
        }
    })

    app.delete("/deleteBookListing", async (req: Request, res: Response) => {
        try{
            const { title, condition, user} = req.body;

            if (!title || !condition || !user) {
                return res.status(400).json({result: "error", error: "Missing fields"})
            }

            const bookQuery = firestore
            .collection("books")
            .where("title", "==", title)
            .where("user", "==", user)
            .where("condition", "==", condition);

            const book = await bookQuery.get();

            if (book.empty) {
                return res.status(404).json({result: "error", error: "No such book to delete"})
            }

            const batch = firestore.batch();
            book.docs.forEach((doc) => {
                batch.delete(doc.ref);
            })

            await batch.commit()

            console.log(`Deleted ${book.docs.length} book(s) with title ${title} for user ${user}`);

            res.status(200).json({
                result: "success",
                message: `Deleted ${book.docs.length} book(s) successfully`,
                deletedCount: book.docs.length
            });

        } catch(error){
            console.error("Error while deleting a book", error)
            res.status(500).json({
                result: error,
                error: "Error while deleting trips"
            });

        }
    })

}