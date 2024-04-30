import bcrypt from 'bcryptjs';
import { ObjectId } from "mongodb";
import { db } from "../data/mongodb";
import { Request ,Response } from "express";
//import { format } from 'date-fns';
import { book } from './book';
import jwt from 'jsonwebtoken';
import PERMISSIONS_LIST from '../config/permissions';

export interface user {
    _id: ObjectId,
    name: string,
    email: string,
    hash: string,
    books: book[],
    refreshToken: string,
    roles:{
        user?:number,
        editor?:number,
        admin?:number,
    }
}

export class User {
    constructor(
        private _id: ObjectId, 
        private _name: string, 
        private _email: string, 
        private _hash: string, 
        private _books: book[], 
        private _refreshToken: string = '',
        private _roles: {user?:number, editor?:number, admin?:number} = {user:PERMISSIONS_LIST.User}, //DEFAULT
    ) { }

    get info(): { _id: ObjectId, name: string, email: string, roles:{user?:number, editor?:number, admin?:number} } {
        return {
            _id: this._id,
            name: this._name,
            email: this._email,
            roles:this._roles,
        }
    }

    async login(pass: string, res: Response): Promise<void> {

        let validate = await bcrypt.compare(pass, this._hash);
        if (!validate) {
            res.status(401).send('Senha incorreta!')
        } else {
            // SEND JWT
            // res.status(200).json({
            //     "message":"Login feito com sucesso!"
            // })
            let accessToken = jwt.sign(
                { "username": this._name, "roles":this._roles },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: '50s' }
            )
            let refreshToken = jwt.sign(
                { "username": this._name, "roles":this._roles },
                process.env.REFRESH_TOKEN_SECRET as string,
                { expiresIn: '1d' }
            )
            this._refreshToken = refreshToken;

            db.collection('clients').updateOne({ _id: this._id }, {
                $set: {
                    refreshToken: this._refreshToken
                }
            })
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite:'none',
                secure:true,
            })
            res.json({ accessToken })
        };
    }
    async logout(req:Request, res: Response){
        let cookies = req.cookies;
        if(!cookies?.jwt) return res.status(403) //Forbidden
        res.clearCookie('jwt', {httpOnly:true, sameSite:'none', secure:true});
        try{
            await db.collection('clients').updateOne({_id:this._id}, {
                $set:{
                    refreshToken:''
                }
            })
            this._refreshToken = '';
            res.send('LOGOUT REALIZADO!')
        }catch(err){
            res.sendStatus(400);
        }
    }
    async register(response: Response): Promise<void> {
        try {
            await db.collection<user>('clients').insertOne({
                _id: this._id,
                name: this._name,
                email: this._email,
                hash: this._hash,
                books: this._books,
                refreshToken: this._refreshToken,
                roles:this._roles,
            })
            response.send(`Usuário registrado ${this._id}`);
        } catch (err) {
            response.send(err);
        }
    }
    async alterarEmail(email: string, pass: string, res: Response) {
        let id = new ObjectId(this._id);
        try {
            let result = bcrypt.compareSync(pass, this._hash);
            if (result) {
                this._email = email;
                await db.collection<user>('clients').updateOne({ _id: id }, {
                    $set: {
                        email: email
                    }
                })
                res.status(200).send('Email updated!')
            } else {
                res.status(500).send('SENHA INCORRETA, ALTERAÇÃO NÃO AUTORIZADA!')
            }
        } catch (err) {
            res.send(err);
        }
    }
}