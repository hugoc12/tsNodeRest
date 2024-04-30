import {Request, Response, NextFunction} from 'express';
import PERMISSIONS_LIST from '../config/permissions';

interface MyRequest extends Request{
    user:string,
    roles:number[],
}
export default async function verifyPermissions(req:MyRequest, res:Response, next:NextFunction){
    try{
        //let data = await db.collection<user>('clients').findOne({name:req.user}) as user;
        console.log(req.roles);
        if(req.roles.includes(PERMISSIONS_LIST.Admin)){
            next()
        }else{
            res.status(401).send('Usuário não possui permissão');
        };
    }catch(err){
        res.status(401).send('unauthorized')
    }
}