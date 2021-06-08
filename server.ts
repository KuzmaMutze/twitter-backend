import dotenv from "dotenv";
dotenv.config()
import './core/db'

import express from 'express'
import { UserCtrl } from './controller/UserController'
import { registerValidations } from './validations/register'




const app = express()

app.use(express.json())

app.get('/users', UserCtrl.index) 
app.post('/users', registerValidations, UserCtrl.create) 
// app.patch('/users', UserCtrl.update) 
// app.delete('/users', UserCtrl.delete) 

app.listen(process.env.PORT, () => {

    console.log("server running");
    
})