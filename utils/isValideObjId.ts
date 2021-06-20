import { mongoose } from "../core/db";

export const isValideObjId = mongoose.Types.ObjectId.isValid
