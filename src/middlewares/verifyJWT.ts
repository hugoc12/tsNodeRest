import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {Request, Response, NextFunction} from 'express';

dotenv.config();

export interface MyRequest extends Request{
    user:string
}

export default async function verifyJWT(req:MyRequest, res:Response, next:NextFunction){
    try{
        const authHeader = req.headers['authorization']; //Bearer Token
        if(!authHeader) return res.status(401).send('Header not bearer authorization');
        const token = authHeader.split(' ')[1]; //ACCESS TOKEN
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded:any)=>{
            if(err) throw new Error('Token de acesso inválido')
            req.user = decoded.username;
            next();
        });
    }catch(err){
        res.status(403).send(`${err}`);
    }
}