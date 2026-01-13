import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import connectDB from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = 4000;

//CORS middleware - allow requests from React Native
app.use(cors());

//data understanding middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database
connectDB();

app.get("/", (req, res) => {
  res.json({ msg: "hellow world" });
});

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`the server is running at http://localhost:${PORT}`);
});
