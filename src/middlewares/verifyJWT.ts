import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {Request, Response, NextFunction} from 'express';
import { User, user } from '../models/user';
import { db } from '../data/mongodb';

dotenv.config();

export interface MyRequest extends Request{
    username:string,
    roles:number[],
}

export default async function verifyJWT(req:MyRequest, res:Response, next:NextFunction){
    try{
        const authHeader = req.headers['authorization']; //Bearer Token
        if(!authHeader) return res.status(401).send('Header not bearer authorization');
        const token = authHeader.split(' ')[1]; //ACCESS TOKEN
        let cookies = req.cookies;
        const data = await db.collection('clients').findOne({refreshToken:cookies.jwt}) as user;
        if(!data) return res.status(400).send('Usuário não encontrado!');
        
        let user = new User(data._id, data.name, data.email, data.hash, data.books, data.refreshToken);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded:any)=>{
            if(err || decoded.username != user.info.name) throw new Error('Token de acesso inválido')
            req.username = decoded.username;
            req.roles = Object.values(decoded.roles);
            next();
        });
    }catch(err){
        res.status(403).send(`${err}`);
    }
}