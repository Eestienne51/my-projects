import { Express } from "express";
import { Request, Response } from "express";
import { firestore } from "../firebase/firebasesetup";
import { AuthRequest, verifyToken } from "../firebase/handleAuthentication";
import { admin } from "../firebase/firebasesetup";

export function registerTradeHandler(app: Express){
    app.get("/getTradesForUser", async (req: Request, res: Response) => {
        try {
            const userId = typeof req.query.userId === "string" ? req.query.userId.trim() : "";

            if (!userId){
                return res.status(400).json({
                    success: false,
                    message: "No user ID provided. Please provide one and try again."
                })
            }

            const requestedTradesQuery = firestore.collection("trades")
            .where("requesterId", "==", userId);

            const receivedTradesQuery = firestore.collection("trades")
            .where("accepterId", "==", userId);

            const requestedTradesDocs = await requestedTradesQuery.get();
            const receivedTradesDocs = await receivedTradesQuery.get();

            let requestedTrades: any[] = [];
            let receivedTrades: any[] = [];

            requestedTradesDocs.forEach((doc) => {
                requestedTrades.push({id: doc.id, ...doc.data()});
            });

            receivedTradesDocs.forEach((doc) => {
                receivedTrades.push({id: doc.id, ...doc.data()});
            });

            return res.status(200).json({
                success: true,
                requestedTrades: requestedTrades,
                receivedTrades: receivedTrades
            })


        } catch(error: any){
            console.error("Failed to trades for user:", error);
            res.status(500).json({ result: false, error: "Server error while getting trades." });
        }
    });


    app.post("/addTrade", verifyToken, async (req: AuthRequest, res: Response) => {
        try{
            const { accepterId, bookRequested, requesterId, bookOffered } = req.body;

            if (!accepterId || !bookRequested || !requesterId || !bookOffered){
                return res.status(400).json({
                    success: false,
                    message: "Missing Fields"
                })
            }

            const docRef = await firestore.collection("trades").add({
                accepterId,
                bookRequested,
                requesterId,
                bookOffered,
                createdAt:  admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json({
                success: true,
                message: "Trade saved successfully",
                tradeId: docRef.id
            })
        } catch(error){
            console.error("Failed to save trade", error);
            return res.status(500).json({
                success: false,
                error: "Error while saving book"
            })
        }

    });

    app.get("/getTradesForBook/:bookId", async (req: Request, res: Response) => {
        try{
            const bookId = req.params.bookId;

            const requestedBookTradeQuery = firestore.collection("trades")
            .where("bookRequested", "==", bookId).limit(1);
            const offeredBookTradeQuery = firestore.collection("trades")
            .where("bookOffered", "==", bookId).limit(1);

            const requestedBookTradeDoc = await requestedBookTradeQuery.get();
            const offeredBookTradeDoc = await offeredBookTradeQuery.get();

            if (!requestedBookTradeDoc.empty || !offeredBookTradeDoc.empty){
                return res.status(200).json({
                    success: true,
                    involvedInTrade: true
                })
            }

            return res.status(200).json({
                success: true,
                involvedInTrade: false
            })
        } catch(error){
            return res.status(500).json({
                success: false,
                error: error
            })
        }
    })

}