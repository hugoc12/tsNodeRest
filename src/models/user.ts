import bcrypt from 'bcryptjs';
import { ObjectId } from "mongodb";
import { db } from "../data/mongodb";
import { Response } from "express";
//import { format } from 'date-fns';
import { book } from './book';
import jwt from 'jsonwebtoken';

export interface user {
    _id: ObjectId,
    name: string,
    email: string,
    hash: string,
    books: book[],
    refreshToken: string
}

export class User {
    constructor(private _id: ObjectId, private _name: string, private _email: string, private _hash: string, private _books: book[], private _refreshToken: string = '') { }

    get info(): { _id: ObjectId, name: string, email: string } {
        return {
            _id: this._id,
            name: this._name,
            email: this._email,
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
                { "userauth": this._name },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: '30s' }
            )
            let refreshToken = jwt.sign(
                { "userauth": this._name },
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
                maxAge: 24 * 60 * 60 * 1000
            })
            res.json({ accessToken })
        };
    }

    async register(response: Response): Promise<void> {
        try {
            //const newObjId = new ObjectId(this._id.replace(/-/g, '').substring(0, 24));
            await db.collection<user>('clients').insertOne({
                _id: this._id,
                name: this._name,
                email: this._email,
                hash: this._hash,
                books: this._books,
                refreshToken: this._refreshToken,
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