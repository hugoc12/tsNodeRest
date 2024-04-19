import express from 'express';
import { BSON } from 'mongodb';
import { db } from '../data/mongodb';

export const routerUsers = express.Router();

routerUsers.route('/users').get(async (req, res)=>{
    // all users
    const data = await db.collection('users').find({}, {limit:4}).toArray();
    res.send(data);
})

routerUsers.route('/user/:id').get(async (req, res)=>{
    // find one user br id
    const id = new BSON.ObjectId(req.params.id);
    const data = await db.collection('users').findOne({_id:id});
    res.send(data);
})