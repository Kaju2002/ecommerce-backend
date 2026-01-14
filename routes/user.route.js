import express from "express";
import { forgotPassword, loginUser, registerUser, resendOtp, resendResetOtp, resetPassword, verifyOtp, verifyResetOtp } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-otp" , verifyOtp);
userRouter.post("/resend-otp", resendOtp);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-reset-otp", verifyResetOtp);
userRouter.post("/resend-reset-otp", resendResetOtp);
userRouter.post("/reset-password", resetPassword);
export default userRouter;
