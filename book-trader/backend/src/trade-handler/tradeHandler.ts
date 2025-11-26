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

            console.log([accepterId, bookRequested, requesterId, bookOffered])
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
                status: "pending",
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
    });

    app.delete("/deleteTrade/:tradeId", verifyToken, async (req: AuthRequest, res: Response) => {
        try{
            const tradeId = typeof req.params.tradeId === "string" ? req.params.tradeId.trim() : "";

            if (!tradeId){
                return res.status(400).json({
                    success: false,
                    error: "No trade ID provided. Please provide one and try again."
                })
            }

            const trade = await firestore.collection("trades").doc(tradeId).get();

            if (!trade.exists){
                return res.status(404).json({
                    success: false,
                    error: "No trade found to delete"
                })
            }

            const tradeData = trade.data();

            if (tradeData?.requesterId !== req.user?.uid){
                return res.status(403).json({
                    success: false,
                    error: "User does not have permission to delete this trade"
                })
            }

            await trade.ref.delete();

            console.log("Trade delete successfully");

            return res.status(200).json({
                success: true,
                message: "Trade deleted successfully"
            })

        } catch(error){
            console.error("Error while deleting a trade", error)
            res.status(500).json({
                success: false,
                error: "Error while deleting trade"
            });
        }
    })


    app.put("/updateTradeStatus/:tradeId", verifyToken, async (req: AuthRequest, res: Response) => {
        try{
            const tradeId = typeof req.params.tradeId === "string" ? req.params.tradeId.trim() : "";

            const { updatedStatus } = req.body;

            if (!tradeId || !updatedStatus){
                return res.status(400).json({
                    success: false,
                    error: "Missing fields and/ or parameters"
                })
            }

            const validStates = ["pending", "accepted", "declined"];

            if (!validStates.includes(updatedStatus)){
                return res.status(400).json({
                    success: false,
                    error: "Incorrect status provided"
                })
            }

            const tradeDoc = await firestore.collection("trades").doc(tradeId).get()

            if (!tradeDoc.exists){
                return res.status(404).json({
                    success: false,
                    error: "No trade found to update"
                })
            }

            const tradeData = tradeDoc.data();

            if (tradeData?.status === "accepted" || tradeData?.status === "declined"){
                return res.status(400).json({
                    success: false,
                    error: "Cannot update accepted or declined trade"
                })
            }

            await firestore.collection("trades").doc(tradeId).update({
                status: updatedStatus,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json({
                success: true,
                message: `Status of trade ${tradeId} successfully updated to ${updatedStatus}`
            })

        } catch(error){
            console.error("Error while updating trade status", error)
            res.status(500).json({
                success: false,
                error: "Error while updating trade status"
            });
        }
    })

}