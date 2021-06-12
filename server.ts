import dotenv from "dotenv";
dotenv.config()
import './core/db'

import express from 'express'
import { UserCtrl } from './controller/UserController'
import { registerValidations } from './validations/register'




const app = express()

app.use(express.json())

// TODO: 
// 1. скрыть поля confirmHash и password при получении пuser
// 2. Сделать авторизацию через JWT + Password
// 3. Сделать возможность добавлять твиты через авторизованного пользователя


app.get('/users', UserCtrl.index) 
app.post('/users', registerValidations, UserCtrl.create) 
app.get('/users/verify', registerValidations, UserCtrl.verify) 
// app.patch('/users', UserCtrl.update) 
// app.delete('/users', UserCtrl.delete) 

app.listen(process.env.PORT, () => {

    console.log("server running");
    
})