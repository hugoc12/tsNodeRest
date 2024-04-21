import { ObjectId } from "mongodb"

type dataReserve = {
    status:boolean,
    date:string|false,
    client:ObjectId|false,
}

export interface book{
    _id:ObjectId,
    title:string,
    author:string,
    reserve:dataReserve
}

export class Book{
    constructor(private _id:ObjectId, private _title:string, private _author:string, private _reserve:dataReserve){}
    
}