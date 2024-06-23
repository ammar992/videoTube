import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("mongodb is connected");
    } catch (error) {
        console.log("mongodb connection error",error.message);
        process.exit(1);
    }
}

export {connectDb};