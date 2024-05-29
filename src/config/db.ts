import mongoose from "mongoose";

import { config } from "./config";

const connectDB =async () => {
    try {
        
        mongoose.connection.on("connected",()=>{
            console.log("connected to database SucessFully")
        })
        
        mongoose.connection.on("error",(err)=>{
            console.log("Error in connecting to database",err)
        })
        await mongoose.connect(config.databaseUrl as string);

    } catch (error) {
        console.log("Failed connection",error);
        process.exit(1);
    }
}
export default connectDB;