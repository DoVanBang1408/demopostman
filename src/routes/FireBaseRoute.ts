import  express, { Router } from "express";
import sendFirebaseNoti from "../service/transport/express/sendFirebaseNoti.api";
const route = express.Router(); // Sử dụng đường dẫn /send cho route
 route.post("/send", sendFirebaseNoti); 
 export default route;
