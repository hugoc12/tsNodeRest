import { ObjectId } from "mongodb";
import { db } from "../data/mongodb";
import { Response } from "express";

export interface user{
    _id:string,
    nome:string,
    email:string,
}

export class User{
    constructor(private _id:string, private _nome:string, private _email:string, private _pass:string){}
    
    get info():user{
        return{
            _id:this._id,
            nome:this._nome,
            email:this._email
        }
    }

    async register(response:Response):Promise<void>{
        try{
            const newObjId = new ObjectId(this._id.replace(/-/g, '').substring(0, 24));
            await db.collection('users').insertOne({
                _id:newObjId,
                name:this._nome,
                email:this._email,
                password:this._pass
            })
            response.send(`Usuário registrado ${newObjId}`);
        }catch(err){
            response.send(err);
        }
    }
}