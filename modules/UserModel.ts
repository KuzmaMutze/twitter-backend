import { model, Schema, Document } from "mongoose";

export type UserType = {
    _id?: string
    email: string
    fullname: string
    username: string
    password: string
    confirmHash: string
    confirmed?: boolean
    location?: string
    about?: string
    website?: string
    tweets?: Array<string>
}

export type UserModelDocumentType = UserType & Document

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
        // select: false,
        type: String
    },
    confirmHash: {
        unique: true,
        required: true,
        type: String,
        select: false,
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
    tweets: [{type: Schema.Types.ObjectId, ref: 'Tweet'}],
    // notifications: String,
    // bookmarks: String,

},{
    timestamps: true
})

UserSchema.set('toJSON', {
	transform(_: any, obj: any) {
		delete obj.password
		delete obj.confirmHash
		return obj
	}
})

export const UserModel = model<UserModelDocumentType>("User", UserSchema)