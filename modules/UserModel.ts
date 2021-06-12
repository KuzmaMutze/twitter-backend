import { model, Schema, Document } from "mongoose";

export type UserType = {
    email: string
    fullname: string
    username: string
    password: string
    confirmHash: string
    confirmed?: boolean
    location?: string
    about?: string
    website?: string
}

type UserModelDocumentType = UserType & Document

const UserSchema = new Schema<UserType>({
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

export const UserModel = model<UserModelDocumentType>("User", UserSchema)