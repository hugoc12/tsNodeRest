interface user{
    nome:string,
    email:string,
}

class User{
    constructor(private _nome:string, private _email:string, private _pass:string){}
    
    get info():user{
        return{
            nome:this._nome,
            email:this._email
        }
    }
}