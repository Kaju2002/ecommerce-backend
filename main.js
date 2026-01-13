import express from 'express';
import userRouter from './routes/user.route.js';
import connectDB from './lib/db.js';

const app= express()
const PORT  = 4000;

//data understanding middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//database 
connectDB();

app.get('/',(req,res)=>{
    res.json({msg:"hellow world"})
})

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`the server is running at http://localhost:${PORT}`);
});