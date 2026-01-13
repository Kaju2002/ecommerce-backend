import express from 'express';
import userRouter from './routes/user.route.js';
import connectDB from './lib/db.js';

const app= express()
const PORT  = 4000;

//database 
connectDB();

app.get('/',(req,res)=>{
    res.json({msg:"hellow world"})
})

app.use("/user/register", userRouter);

app.listen(PORT, () => {
  console.log(`the server is running at http://localhost:${PORT}`);
});