import express from "express";
import { userRegister } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/",userRegister);
export default userRouter;
