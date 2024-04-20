import express from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../data/mongodb';
import multer from 'multer';
import {v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User, user } from '../models/user';

const upload = multer();

export const routerUsers = express.Router();

routerUsers.route('/users').get(async (req, res)=>{
    // all users
    try{
        const data = await db.collection('clients').find({}, {limit:4}).toArray();
        res.send(data);
    }catch(err){
        res.send(err);
    }
})

routerUsers.route('/user/:id')
    .get(async (req, res)=>{
        // find one user br id
        try{
            const id = new ObjectId(req.params.id);
            const data = await db.collection<user>('clients').findOne({_id:id});
            const user = new User(data?._id as ObjectId, data?.name as string, data?.email as string, data?.hash as string)
            res.json(user.info);
        }catch(err){
            res.send(err);
        }
    })
    .put([express.json() ,async (req:express.Request, res:express.Response)=>{
        try{
            let id = new ObjectId(req.params.id);
            let data = await db.collection<user>('clients').findOne({_id:id});
            let user = new User(data?._id as ObjectId, data?.name as string, data?.email as string, data?.hash as string)
            await user.alterarEmail(req.body.email, req.body.pass, res);
        }catch(err){
            res.send(err);
        }
    }])

routerUsers.route('/add-user').post(upload.none()) // Multipart Form parse
routerUsers.route('/add-user').post(async (req, res)=>{
    // add user
    try{
        const userForm:{nome:string, email:string, pass:string} = req.body;
        const id = uuidv4();
        const objId = new ObjectId(id.replace(/-/g, '').substring(0, 24));
        const hash = bcrypt.hashSync(userForm.pass, 8);
        const newUser = new User(objId, userForm.nome, userForm.email, hash);
        await newUser.register(res);
    }catch(err){
        res.send(err);
    }

})