export interface user{
    id:string,
    nome:string,
    email:string,
}

export class User{
    constructor(private _id:string, private _nome:string, private _email:string, private _pass:string){}
    
    get info():user{
        return{
            id:this._id,
            nome:this._nome,
            email:this._email
        }
    }
}