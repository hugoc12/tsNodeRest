import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../data/mongodb';
import { User, user } from '../models/user';
import { ObjectId } from 'mongodb';
import { book } from '../models/book';

dotenv.config();

export async function refreshToken(req:Request, res:Response){
    try{
        const cookie = req.cookies;
        if(!cookie?.jwt) throw new Error('COOKIE NÃO ENCONTRADO!');
        const refreshToken = cookie.jwt;

        let data = await db.collection<user>('clients').findOne({refreshToken:refreshToken});
        let user = new User(data?._id as ObjectId, data?.name as string, data?.email as string, data?.hash as string, data?.books as book[], data?.refreshToken);
        
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err:jwt.VerifyErrors | null, decoded:any)=>{
            if(err||decoded.username != user.info.name) throw new Error('Usuário precisa fazer login novamente - TOKEN REFRESH INVÁLIDO!/name inválido');
            let accessToken = jwt.sign(
                { "username": user.info.name },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: '50s' }
            )
            res.json({accessToken});
        })
    }catch(err){
        res.status(401).send(`${err}`);
    }
}