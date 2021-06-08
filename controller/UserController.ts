import express from "express";
import { validationResult } from "express-validator";
import { UserModel } from "../modules/UserModel";
import { generateMD5 } from "../utils/generateHash";
import { sendEmail } from "../utils/sendEmail";

class UserController {
    async index(_: express.Request, res: express.Response): Promise<void>{
        try {
            const users = await UserModel.find({}).exec()

            res.json({
                status: 'success',
                data: users
            })
        } catch (error) {
            res.json({
                status: 'error',
                message: JSON.stringify(error)
            })
        }
    }
    async create(req: express.Request, res: express.Response): Promise<void>{
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400).json({status: "error", errors: errors.array()})
                return 
            }

            const data = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                fullname: req.body.email,
                confirmHash: generateMD5(process.env.SECRET_KEY || Math.random().toString())
            }

            const user = await UserModel.create(data)
            
            res.json({
                status: "success",
                data: user
            })
            
            sendEmail({
                emailFrom: "admin@twitter.com",
                emailTo: data.email,
                subject: "Подтверждение почты Twitter Clone",
                html: `Для того, чтобы подтвердить почту, перейдите 
                <a href="http://localhost:${process.env.PORT || 8888}/signup/verify?hash=${data.confirmHash}">по этой ссылке</a>`,
            })
            
        } catch (error) {
            res.json({
                status: "error",
                data: error
            })
        }
    }
}

export const UserCtrl = new UserController()

