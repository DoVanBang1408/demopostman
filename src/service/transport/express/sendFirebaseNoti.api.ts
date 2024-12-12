import  { NextFunction, Request, Response } from "express";
import NotificationService from "../../NotificationService";
import { sendNotification } from "../../../config/firebase";
const sendFirebaseNoti = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {deviceToken} = req.body;
        // await NotificationService.sendNotification(title, body, deviceToken);
        console.log("sdsdfsdfdsf")
        await sendNotification(deviceToken);
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        next(error)
    }
}

export default sendFirebaseNoti;