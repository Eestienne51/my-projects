import { Express } from "express";
import { Request, Response } from "express";
import { firestore } from "../firebase/firebasesetup";
import { admin } from "../firebase/firebasesetup";

export function registerUsernameHandler(app: Express){
    app.get("/getUsername", async (req: Request, res: Response) => {
        try{
            const username = req.query.username;

            if (username === ""){
                console.log(username);
                return res.status(400).json({
                    success: false,
                    message: "No username provided. Please provide one and try again."
                })
            }

            const usernameQuery = firestore.collection("usernames").where("username", "==", username);

            const usernameRecord = await usernameQuery.get();

            let usernames: any[] = []
            usernameRecord.forEach((doc) => {
                usernames.push({id: doc.id, ...doc.data()});
            });

            if (usernames.length > 0){
                return res.status(200).json({
                    success: true,
                    message: `User ${username} is registered`,
                });
            }
            else {                
                return res.status(404).json({
                    success: false,
                    message: "No username found"
                });

            }
        

        }
        catch(error){
            console.error("Failed to get books:", error);
            res.status(500).json({ error: "Server error while getting books." });
        }

    
    })

    app.get("/getUsernameById", async (req: Request, res: Response) => {
        try{
            const userId = req.query.userId;

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "No user ID provided. Please provide one and try again."
                })
            }

            const userIdQuery = firestore.collection("usernames").where("userId", "==", userId);

            const usernameRecord = await userIdQuery.get();

            let usernames: any[] = []
            usernameRecord.forEach((doc) => {
                usernames.push({id: doc.id, ...doc.data()});
            });

            if (usernames.length > 0){
                return res.status(200).json({
                    success: true,
                    usernames: usernames
                });
            }
            else {                
                return res.status(404).json({
                    success: false,
                    message: "No username found"
                });

            }
        

        }
        catch(error){
            console.error("Failed to get books:", error);
            res.status(500).json({ error: "Server error while getting books." });
        }

    
    })


    app.post("/addUsername", async (req: Request, res: Response) => {
        try {
            const { username, userId }  = req.body;
            console.log("1")
            if (!username || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "No user provided. Please provide one and try again."
                })
            }
            console.log("2")
            const docRef = await firestore.collection("usernames").add({
                username,
                userId,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            })
            
            console.log("3")
            return res.status(200).json({
                success: true,
                message: `Username ${username} saved successfully`,
                bookId: docRef.id
            })            


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error while saving username"
            })

        }
        
    
    })
}

