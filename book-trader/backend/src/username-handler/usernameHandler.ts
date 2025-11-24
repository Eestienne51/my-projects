import { Express } from "express";
import { Request, Response } from "express";
import { firestore } from "../firebase/firebasesetup";
import { admin } from "../firebase/firebasesetup";
import { verifyToken, AuthRequest } from "../firebase/handleAuthentication";

export function registerUsernameHandler(app: Express){
    app.get("/getUsername", async (req: Request, res: Response) => {
        try{
            const username = typeof req.query.username === "string" ? req.query.username.trim() : "";

            if (!username){
                console.log(username);
                return res.status(400).json({
                    success: false,
                    message: "No username provided. Please provide one and try again."
                })
            }

            const usernameQuery = firestore.collection("usernames").where("username", "==", username).limit(1);

            const snapshot = await usernameQuery.get();

            if (!snapshot.empty){
                return res.status(200).json({
                    success: true,
                    exists: true,
                    message: `Username is taken`,
                });
            }
            else {                
                return res.status(200).json({
                    success: true,
                    exists: false,
                    message: `Username is available`,
                });
            }
        

        }
        catch(error){
            console.error("Error checking username:", error);
            res.status(500).json({ success: false, error: "Server error while checking username." });
        }
    })


    app.get("/getUsernameById", async (req: Request, res: Response) => {
        try{
            const userId = typeof req.query.userId === "string" ? req.query.userId.trim() : "";

            if (!userId){
                return res.status(400).json({
                    success: false,
                    message: "No user ID provided. Please provide one and try again."
                })
            }

            const usernameRecord = await firestore.collection("usernames").doc(userId).get();

            if (usernameRecord.exists){
                const usernameData = usernameRecord.data();
                return res.status(200).json({
                    success: true,
                    username: usernameData?.username,
                    userId: usernameRecord.id
                });
            }
            else {                
                return res.status(404).json({
                    success: false,
                    message: "No username found for this user"
                });

            }
        

        }
        catch(error){
            console.error("Failed to get username:", error);
            res.status(500).json({ success: false, error: "Server error while getting username." });
        }

    
    })


    app.post("/addUsername", verifyToken, async (req: AuthRequest, res: Response) => {
        try {
            const { username }  = req.body;
            const authenticatedUserId = req.user?.uid;

            
            if (!username || !authenticatedUserId) {
                return res.status(400).json({
                    success: false,
                    message: "No user provided. Please provide one and try again."
                })
            }

            // Check if username already exists
            const usernameQuery = firestore.collection("usernames")
            .where("username", "==", username)
            .limit(1);

            const existingUsername = await usernameQuery.get();

            if (!existingUsername.empty) {
                return res.status(409).json({
                    success: false,
                    message: "Username already taken"
                });
            }

            const existingUserDoc = await firestore.collection("usernames").doc(authenticatedUserId).get();
            
            if (existingUserDoc.exists) {
                return res.status(409).json({
                    success: false,
                    message: "User already has a username"
                });
            }   

            await firestore.collection("usernames").doc(authenticatedUserId).set({
                username: username,
                userId: authenticatedUserId,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });  

            return res.status(200).json({
                success: true,
                username: username,
                message: `Username ${username} saved successfully`
            })  


        } catch (error) {
            console.error("Failed to add username:", error);
            return res.status(500).json({
                success: false,
                message: "Error while saving username"
            })

        }
        
    
    })
}

