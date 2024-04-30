import express, {Request, Response} from 'express';
import multer from 'multer';
import { getAllUsers, getUser, addUser, putEmail, delUser, login, logout } from '../controllers/users';
import verifyJWT from '../middlewares/verifyJWT';
import { refreshToken } from '../middlewares/refreshToken';
import verifyPermissions from '../middlewares/verifyPermissions';
import cookie from 'cookie-parser';

const upload = multer();

export const routerUsers = express.Router();

routerUsers.use(cookie())

routerUsers.route('/login').get([upload.none(), login])

routerUsers.route('/logout/:id').get(logout)

routerUsers.route('/update-token').get(refreshToken);

routerUsers.route('/add-user').post([upload.none(), addUser])

routerUsers.route('/users').get([verifyJWT, getAllUsers]);

routerUsers.route('/user/:id')
    .get(getUser)
    .delete([verifyJWT, verifyPermissions, delUser])

routerUsers.route('/user/update-email/:id').put([express.json(), putEmail])

routerUsers.use((req, res)=>{res.send(`/collection-user -> ${req.url} - rota não encontrada! `)})