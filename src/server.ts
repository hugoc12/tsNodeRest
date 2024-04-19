import express from 'express';
import dotenv from 'dotenv';

import { routerUsers } from './routers/users';

dotenv.config();
const app = express();

app.use('/collection', routerUsers)

app.listen(process.env.PORT, ()=>{
    console.log(`SERVER LISTEN IN PORT ${process.env.PORT}`)
})