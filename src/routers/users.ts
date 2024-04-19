import express from 'express';
import { BSON } from 'mongodb';
import { db } from '../data/mongodb';
import multer from 'multer';
import {v4 as uuidv4 } from 'uuid';
import { User } from '../models/user';

const upload = multer();

export const routerUsers = express.Router();

routerUsers.route('/users').get(async (req, res)=>{
    // all users
    try{
        const data = await db.collection('users').find({}, {limit:4}).toArray();
        res.send(data);
    }catch(err){
        res.send(err);
    }
})

routerUsers.route('/user/:id').get(async (req, res)=>{
    // find one user br id
    try{
        const id = new BSON.ObjectId(req.params.id);
        const data = await db.collection('users').findOne({_id:id});
        res.send(data);
    }catch(err){
        res.send(err);
    }
})

routerUsers.route('/add-user').post(upload.none()) // Multipart Form parse
routerUsers.route('/add-user').post(async (req, res)=>{
    // add user
    try{
        const userForm:{nome:string, email:string, pass:string} = req.body;
        const id = uuidv4();
        const newUser = new User(id, userForm.nome, userForm.email, userForm.pass);
        await newUser.register(res);
    }catch(err){
        res.send(err);
    }

})