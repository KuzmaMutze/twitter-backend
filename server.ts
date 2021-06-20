import dotenv from "dotenv";
dotenv.config()
import './core/db'
import cors from "cors"
import express from 'express'
import { UserCtrl } from './controller/UserController'
import { registerValidations } from './validations/register'
import { passport } from "./core/passport";
import { TweetCtrl } from "./controller/TweetsController";
import { createTweetValidations } from "./validations/createTweets";
import { UploadCtrl } from "./controller/UploadFileController";
import multer from "multer";



const app = express()
const storage = multer.memoryStorage()

const upload = multer({ storage })

// var storage = multer.diskStorage({
//   destination: function (_, __, cb) {
//     cb(null, __dirname + '/uploads')
//   },
//   filename: function (_, file, cb) {
//       const ext = file.originalname.split(".").pop()
//     cb(null, file.fieldname + '-' + Date.now() + "." + ext)
//   }
// })
 
// var upload = multer({ storage: storage })

app.use(cors())
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

app.get('/tweets', TweetCtrl.index);
app.get('/tweets/:id', TweetCtrl.show);
app.get('/tweets/user/:id', TweetCtrl.getUserTweets);
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetCtrl.delete);
app.post('/tweets', passport.authenticate('jwt'), createTweetValidations, TweetCtrl.create);
app.patch('/tweets/:id', passport.authenticate('jwt'), createTweetValidations, TweetCtrl.update);

app.post('/upload', upload.single('image'), UploadCtrl.upload);


app.listen(process.env.PORT, () => {

    console.log("SERVER RUNNING");
    
})
