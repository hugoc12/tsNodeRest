import {Router} from 'express';
import Book from '../models/book';
import { book } from '../models/book';
import express, {Request, Response} from 'express';
import { ObjectId } from 'mongodb';

export const routerBooks = Router();

routerBooks.route('/getBook').get(async (req, res)=>{
    let bookname = req.query.bookname;
    try{
        let data = await Book.findOne<book>({title:bookname});
        if(data){
            res.status(200).send(data);
        }else{
            res.send('Dados não encontrados!');
        }
    }catch(err){
        res.send(err);
    }
})

routerBooks.route('/getBooks').get(async (req, res)=>{
    try{
        let data = await Book.find({});
        res.json(data);
    }catch(err){
        res.status(400).send(err);
    }
})

routerBooks.route('/addBook').post(express.json());
routerBooks.route('/addBook').post(async (req:Request, res:Response)=>{
    let data = req.body as book;
    let id = new ObjectId();
    try{
        let resul = await Book.create({_id:id, author:data.author, title:data.title});
        res.status(200).send(`Livro incluído - ${resul}`);
    }catch(err){
        res.send(err);
    }
})