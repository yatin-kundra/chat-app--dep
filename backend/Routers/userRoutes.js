import express, { Router } from "express"
import {registeruser, authUser, allUsers}  from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router()

router.route("/").post(registeruser).get(protect, allUsers);
router.post("/login", authUser);



export default router

