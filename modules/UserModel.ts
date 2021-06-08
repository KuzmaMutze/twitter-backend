import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
        unique: true,
        required: true,
        type: String
    },
    fullname: {
        required: true,
        type: String
    },
    username: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    confirmHash: {
        unique: true,
        required: true,
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    location: String,
    about: String,
    website: String,
    // followers: String,
    // follows: String,
    // tweets: String,
    // notifications: String,
    // bookmarks: String,

})

export const UserModel = model("User", UserSchema)