import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { UserModel, UserModelDocumentType, UserType } from "../modules/UserModel";
import { generateMD5 } from "../utils/generateHash";
import { sendEmail } from "../utils/sendEmail";
import { isValideObjId } from "../utils/isValideObjId";

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

            const user = await UserModel.findById( userId ).populate('tweets').exec()
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
            console.log(errors.array());
            
            if (!errors.isEmpty()) {
                res.status(400).json({status: "error", errors: errors.array()})
                return 
            }
            console.log(req.body.email);
            console.log(req.body.fullname);
            console.log(req.body.username);
            console.log(generateMD5(req.body.password + process.env.SECRET_KEY));
            console.log(generateMD5(Math.random().toString()));
            const data: UserType = {
                email: req.body.email,
                fullname: req.body.fullname,
                username: req.body.username,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirmHash: generateMD5(Math.random().toString()),
                confirmed: true
            }

            const user = await UserModel.create(data)

            
            
            
            res.json({
                status: "success",
                data: user
            })
            console.log(data.confirmHash);
            
            sendEmail({
                emailFrom: "admin@twitter.com",
                emailTo: data.email,
                subject: "?????????????????????????? ?????????? Twitter Clone",
                html: `?????? ????????, ?????????? ?????????????????????? ??????????, ?????????????????? 
                <a href="http://localhost:${process.env.PORT || 8888}/auth/verify?hash=${data.confirmHash}">???? ???????? ????????????</a>`,
            })
            
        } catch (error) {
            res.json({
                status: "error 123",
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
                    token: jwt.sign({data: req.user}, process.env.SECRET_KEY || "123", {expiresIn: "30 days"})

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
    async tweetsController(req: express.Request, res: express.Response): Promise<void>{
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

