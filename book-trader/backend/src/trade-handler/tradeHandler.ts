import { Express } from "express";
import { Request, Response } from "express";
import { firestore } from "../firebase/firebasesetup";

export function registerTradeHandler(app: Express){
    app.get("/getTradesForUser", async(req: Request, res: Response) => {
        try {
            const userId = typeof req.query.userId === "string" ? req.query.userId.trim() : "";

            if (!userId){
                return res.status(400).json({
                    success: false,
                    message: "No user ID provided. Please provide one and try again."
                })
            }
            console.log(userId)

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
    })

}