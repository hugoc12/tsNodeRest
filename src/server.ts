import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { credentials } from './middlewares/credentials';

import { routerUsers } from './routers/users';

export let origins_authorized = ['*']

dotenv.config();
const app = express();

app.use(credentials);

app.use(cors({
    origin:true
}))

app.use('/collection-user', routerUsers)

app.listen(process.env.PORT, ()=>{
    console.log(`SERVER LISTEN IN PORT ${process.env.PORT}`)
})