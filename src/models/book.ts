import { ObjectId } from "mongodb";
import { model, Schema } from 'mongoose'

type dataReserve = {
    status:boolean,
    date:string,
    client:ObjectId,
}

export interface book{
    _id:ObjectId,
    title:string,
    author:string,
    reserve?:dataReserve
}

const bookSchema = new Schema<book>({
    _id:ObjectId,
    title:String, 
    author:String, 
    reserve:Object
})

export default model<book>('Book', bookSchema);