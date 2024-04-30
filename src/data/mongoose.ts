import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async function connect(){
    try{
        await mongoose.connect(process.env.DB_URI_MONGOOSE as string);
    }catch(err){
        console.error(err);
    }
}