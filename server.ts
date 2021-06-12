import dotenv from "dotenv";
dotenv.config()
import './core/db'

import express from 'express'
import { UserCtrl } from './controller/UserController'
import { registerValidations } from './validations/register'
import { passport } from "./core/passport";




const app = express()

app.use(express.json())
app.use(passport.initialize())

// TODO: 
// 2. Сделать авторизацию через JWT + Password
// 3. Сделать возможность добавлять твиты через авторизованного пользователя


app.get('/users', UserCtrl.index) 
app.get('/users/me', passport.authenticate('jwt'), UserCtrl.getUserInfo) 
app.get('/users/:id', UserCtrl.show) 
app.post('/auth/signup', registerValidations, UserCtrl.create) 
app.get('/auth/verify', registerValidations, UserCtrl.verify) 
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);
// app.patch('/users', UserCtrl.update) 
// app.delete('/users', UserCtrl.delete) 

app.listen(process.env.PORT, () => {

    console.log("SERVER RUNNING");
    
})