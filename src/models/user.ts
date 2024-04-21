import bcrypt from 'bcryptjs';
import { ObjectId } from "mongodb";
import { db } from "../data/mongodb";
import { Response } from "express";
import { format } from 'date-fns';
import { book } from './book';

export interface user{
    _id:ObjectId,
    name:string,
    email:string,
    hash:string,
    books:book[],
}

export class User{
    constructor(private _id:ObjectId, private _name:string, private _email:string, private _hash:string, private _books:book[]){}
    
    get info():{_id:ObjectId, name:string, email:string}{
        return{
            _id:this._id,
            name:this._name,
            email:this._email,
        }
    }

    // reserveBook(res:Response):void{
    //     let date = format(new Date(), 'dd/MM/yyyy - H:mm:ss');
    //     console.log(typeof date);
    //     res.send(date);
    // }

    async register(response:Response):Promise<void>{
        try{
            //const newObjId = new ObjectId(this._id.replace(/-/g, '').substring(0, 24));
            await db.collection<user>('clients').insertOne({
                _id:this._id,
                name:this._name,
                email:this._email,
                hash:this._hash,
                books:this._books,
            })
            response.send(`Usuário registrado ${this._id}`);
        }catch(err){
            response.send(err);
        }
    }

    async alterarEmail(email:string, pass:string, res:Response){
        let id = new ObjectId(this._id);
        try{
            let result = bcrypt.compareSync(pass, this._hash);
            if(result){
                this._email = email;
                await db.collection<user>('clients').updateOne({_id:id}, {
                    $set:{
                        email:email
                    }
                })
                res.status(200).send('Email updated!')
            }else{
                res.status(500).send('SENHA INCORRETA, ALTERAÇÃO NÃO AUTORIZADA!')
            }
        }catch(err){
            res.send(err);
        }
    }
}