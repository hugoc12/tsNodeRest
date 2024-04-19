import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.get('/', (req, res)=>{
    res.send('Hellow World!');
})

app.listen(process.env.PORT, ()=>{
    console.log(`SERVER LISTEN IN PORT ${process.env.PORT}`)
})