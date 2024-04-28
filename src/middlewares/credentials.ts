import {Request, Response, NextFunction} from 'express';
import { origins_authorized } from '../server';

export function credentials(req:Request, res:Response, next:NextFunction){
    const origin = req.headers.origin as string;
    if(origins_authorized.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin', '*'); // Liberando acesso a dados retornados pela API
        console.log('access control true');
    }
    next();
}