import { ObjectId } from "typeorm";

export interface DecodedJwtToken {
    id: ObjectId
    email: string
    [x: string]: any 
}