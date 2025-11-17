import { Express } from "express";
import { Request, Response } from "express";
import { firestore } from "../firebase/firebasesetup";
import { AuthRequest, verifyToken } from "../firebase/handleAuthentication";
import { admin } from "../firebase/firebasesetup";


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
                success: true,
                books: books
            });

        }
        catch(error){
            console.error("Failed to get books:", error);
            res.status(500).json({ result: false, error: "Server error while getting books." });
        }

    
    })

    app.post("/addBookListing", verifyToken, async (req: AuthRequest, res: Response) => {
        try{
            const { title, author, description, condition, username } = req.body;
            const userId = req.user?.uid;
            
            if (!title || !author || !description || !condition){
                return res.status(400).json({success: false, error: "Missing fields"})
            }

            const docRef = await firestore.collection("books").add({
                title,
                author,
                description,
                condition,
                userId,
                username,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            
            return res.status(200).json({
                success: true,
                message: "Book saved successfully",
                bookId: docRef.id
            })
        } catch (error){
            console.error("Failed to save book", error);
            return res.status(500).json({
                success: false,
                error: "Error while saving the book"
            })
        }
    })

    app.delete("/deleteBookListing", verifyToken, async (req: AuthRequest, res: Response) => {
        try{
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({success: false, error: "Missing fields"})
            }

            const book = await firestore.collection("books").doc(id).get()


            if (!book.exists) {
                return res.status(404).json({success: false, error: "No such book to delete"})
            }

            const bookData = book.data();

            if (bookData?.userId !== req.user?.uid){
                return res.status(403).json({ success: false, error: "The current user does not have permission to delete this book"});
            }

            await book.ref.delete();


            console.log(`User ${req.user?.uid} deleted book ${id}`);

            res.status(200).json({
                success: true,
                message: "Book deleted successfully"
            });

        } catch(error){
            console.error("Error while deleting a book", error)
            res.status(500).json({
                success: false,
                error: "Error while deleting trips"
            });

        }
    })

    app.get("/getBookById", async (req: Request, res: Response) => {

        try{
            const bookId = typeof req.query.bookId === "string" ? req.query.bookId.trim() : "";

            if (bookId === ""){
                return res.status(400).json({
                    success: false,
                    message: "No book Id provided to fetch"
                })

            }

            const book = await firestore.collection("books").doc(bookId).get();

            if (book.exists){
                return res.status(200).json({
                    success: true,
                    books: {id: book.id, ...book.data()}
                });
            }

            else {
                return res.status(404).json({
                    success: false,
                    message: "No book found for provided id"
                });                
            }



        }
        catch(error){
            console.error("Failed to get book:", error);
            res.status(500).json({ result: false, error: "Server error while getting required book." });
        }

    
    })

}