import { Request, Response } from "express";
import { db } from "../data/mongodb";
import {ObjectId} from 'mongodb';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcryptjs';
import { user, User } from "../models/user";

//let date = format(new Date(), 'dd/MM/yyyy - H:mm:ss');
//ACTIONS

export async function login(req:Request, res:Response){
    try{
        let data = await db.collection<user>('clients').findOne({email:req.body.email});
        if(!data?._id) throw new Error('Email não encontrado!');

        let user = new User(data._id as ObjectId, data.name as string, data.email as string, data.hash as string, data.books)
        await user.login(req.body.pass, res);
    }catch(err){
        let message = (err as Error).message;
        res.status(401).send(message)
    }
}

export async function getAllUsers(req:Request, res:Response){
    try{
        let data = await db.collection('clients').find({}).project({
            _id:1,
            name:1,
            email:1,
        }).toArray();
        res.json(data);
    }catch(err){
        res.send(err);
    }
}

export async function getUser(req:Request, res:Response){
    try{
        let id = new ObjectId(req.params.id);
        let data = await db.collection<user>('clients').findOne({_id:id});
        res.json({
            id:data?._id,
            name:data?.name,
            email:data?.email,
        });
    }catch(err){
        res.send(err);
    }
}

export async function addUser(req:Request, res:Response){
    try{
        let id = new ObjectId(uuidv4().replace(/-/g, '').substring(0, 24));
        let hash = bcrypt.hashSync(req.body.pass);
        let user = new User(id, req.body.name as string, req.body.email as string, hash, []);
        await user.register(res);
    }catch(err){
        res.send(err);
    }
}

export async function putEmail(req:Request, res:Response){
    try{
        let id = new ObjectId(req.params.id);
        let data = await db.collection<user>('clients').findOne({_id:id});
        let user = new User(id, data?.name as string, data?.email as string, data?.hash as string, []);
        await user.alterarEmail(req.body.email, req.body.pass, res);
    }catch(err){
        res.send(err);
    }
}

export async function delUser(req:Request, res:Response){
    try{
        let id = new ObjectId(req.params.id);
        await db.collection('clients').deleteOne({_id:id});
        res.send('Usuário removido!')
    }catch(err){
        res.send(err);
    }
}

// export async function reserveBook(req:Request, res:Response){
//     try{
//         let id = new ObjectId(req.params.id);
//         let data = await db.collection<user>('clients').findOne({_id:id});
//         let user = new User(id, data?.name as string, data?.email as string, data?.hash as string, []);
//     }catch(err){
//         res.send(err);
//     }
// }