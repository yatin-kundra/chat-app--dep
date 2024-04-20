import express, { Router } from "express"
import { protect } from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/sendMessage.js";


const router = express.Router();

router.route("/").post(protect, sendMessage);    // for sending the message and , sendMessage is controller

router.route("/:chatId").get(protect, allMessages)  // for fetching all the messages 

export default router;