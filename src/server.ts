import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { credentials } from './middlewares/credentials';
import { routerUsers } from './routers/users';
import { routerBooks } from './routers/books';
import connect from './data/mongoose';
import mongoose from 'mongoose';

connect(); // Connect to mongoDB

export let origins_authorized = ['*']

dotenv.config();
const app = express();

app.use(credentials);

app.use(cors({
    origin:true
}))

app.use('/collection-user', routerUsers)
app.use('/collection-book', routerBooks)

mongoose.connection.once('open', ()=>{
    console.log('mongoose connected!');
    app.listen(process.env.PORT, ()=>{console.log(`SERVER LISTEN IN PORT ${process.env.PORT}`)});
})