import { model, Schema, Document } from "mongoose";
import {  UserType } from "./UserModel";

export type TweetType = {
    _id?: string
    text: string
    user: UserType 
    images?: Array<string>
}

export type TweetModelDocumentType = TweetType & Document

const TweetSchema = new Schema<TweetType>({
    text: {
        required: true,
        type: String
    },
    user: {
        required: true,
        ref: "User",
        type: Schema.Types.ObjectId
    },
    images: [
        {
            type: String
        }
    ]
}, {
    timestamps: true
})


TweetSchema.set('toJSON', {
    transform: function(_: any, obj: any) {
        delete obj.password
        delete obj.confirmHash
        return obj
    }
})

export const TweetModel = model<TweetModelDocumentType>("Tweet", TweetSchema)