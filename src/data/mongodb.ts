import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.DB_URI as string);

export const db = client.db('Bookstore');