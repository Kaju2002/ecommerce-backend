import express from "express";
import { loginUser, registerUser, resendOtp, verifyOtp } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-otp" , verifyOtp);
userRouter.post("/resend-otp", resendOtp);
export default userRouter;
