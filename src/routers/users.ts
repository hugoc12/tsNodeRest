import express from 'express';
import multer from 'multer';
import { getAllUsers, getUser, addUser, putEmail, delUser } from '../controllers/users';

const upload = multer();

export const routerUsers = express.Router();

routerUsers.route('/users').get(getAllUsers);

routerUsers.route('/user/:id')
    .get(getUser)
    .delete(delUser)

routerUsers.route('/user/update-email/:id').put([express.json(), putEmail])

routerUsers.route('/add-user').post(upload.none()) // Multipart Form parse
routerUsers.route('/add-user').post(addUser)

routerUsers.use((req, res)=>{
    res.send(`/collection-user -> ${req.url} - rota não encontrada! `)
})