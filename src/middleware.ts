import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { jwt_secret } from "./config";
import { User } from "./schema";

interface CustomRequest extends Request {
    userId: string;
}

export async function middleware(req: CustomRequest, res: Response, next: Function) {
    const token = req.headers.authorization;
    try {
        if (!token) {
            return res.status(402).json({
                message: "Token not found"
            });
        }
        const decode: any = jwt.verify(token, jwt_secret);
        const userId = decode.userId;
        const userData = await User.findOne({ _id: userId });
        if (!userData) {
            return res.status(403).json({
                message: "User not found"
            })
        }
        req.userId = userId;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid Token"
        })
    }
}