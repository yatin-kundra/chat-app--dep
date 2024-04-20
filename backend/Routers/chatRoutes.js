import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {accessChat, fetchChat, crateGroupChats, renameGroup, addToGroup, removeFromGroup} from "../controllers/chatController.js"
const router = express.Router();

// route for creating a chat 
// protect is so that an unAuthorized user i.e. if the user is not logged in it can't do all these things

router.route("/").post(protect, accessChat);                 //chat creation
router.route("/").get(protect, fetchChat);                   // to fetch all chats of the logged in user
router.route("/group").post(protect,crateGroupChats);       // to create group chat
router.route("/rename").put(protect,renameGroup);           // to rename group chat
router.route("/groupadd").put(protect,addToGroup)           // to add a new member to the group
router.route("/groupremove").put(protect,removeFromGroup);  // to remove users from the group

export default router;
