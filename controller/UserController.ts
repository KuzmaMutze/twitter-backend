import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { UserModel, UserModelDocumentType, UserType } from "../modules/UserModel";
import { generateMD5 } from "../utils/generateHash";
import { sendEmail } from "../utils/sendEmail";


const isValideObjId = mongoose.Types.ObjectId.isValid
class UserController {
    async index(_: express.Request, res: express.Response): Promise<void>{
        try {
            const users = await UserModel.find({}).exec()

            res.json({
                status: 'success',
                data: users
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: JSON.stringify(error)
            })
        }
    }
    async show(req: any, res: express.Response): Promise<void>{
        try {
            const userId = req.params.id

            if (!isValideObjId(userId)) {
                res.status(400).send()
                return
            }

            const user = await UserModel.findById( userId ).exec()
            if (!user) {
                res.status(404).send()
                return
            }
            res.json({
                status: 'success',
                data: user
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
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

            const data: UserType = {
                email: req.body.email,
                username: req.body.username,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
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
                <a href="http://localhost:${process.env.PORT || 8888}/auth/verify?hash=${data.confirmHash}">по этой ссылке</a>`,
            })
            
        } catch (error) {
            res.json({
                status: "error",
                data: error
            })
        }
    }
    async verify(req: express.Request, res: express.Response): Promise<void> {
        try {
            const hash: any = req.query.hash

            if (!hash) {
                res.status(400).send()
                return
            }
            const user = await UserModel.findOne({ confirmHash: hash }).exec()

            if (user) {
                user.confirmed = true
                user.save()
                res.json({
                    status: 'success',
                })
            } else {
                res.status(404).json({status: "error", message: "User not found"})
            }
            

            
        } catch (error) {
            res.status(500).json({
                status: 'error',
                data: error,
            })
        }
    }
    async afterLogin(req: express.Request, res: express.Response): Promise<void>{
        try {
            const user = req.user ? (req.user as UserModelDocumentType).toJSON() : undefined
            res.json({
                status: 'success',
                data: {
                    ...user,
                    token: jwt.sign({data: req.user}, process.env.SECRET_KEY || "123", {expiresIn: "30d"})

                }
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: JSON.stringify(error)
            })
        }
    }
    async getUserInfo(req: express.Request, res: express.Response): Promise<void>{
        try {
            const user = req.user ? (req.user as UserModelDocumentType).toJSON() : undefined
            res.json({
                status: 'success',
                data: user
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: JSON.stringify(error)
            })
        }
    }
}

export const UserCtrl = new UserController()

