import express from 'express';

const app = express();

//Routes
//HTTPS Methods GET,POST,PUT,PATCH,DELETE

app.get("/",(req,res,next)=>{
    res.json({message:"THe app is running"})
})

export default app;