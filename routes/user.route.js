import express from "express";
import { loginUser, registerUser, verifyOtp } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-otp" , verifyOtp);
export default userRouter;
