import { Response } from "express";
import jwt from "jsonwebtoken";
import { CustomMiddlewareRequest, jwt_secret } from "../data/config";
import { Admin_GHOST } from "../data/schema";


async function middleware(req: CustomMiddlewareRequest, res: Response, next: Function) {
    const token = req.headers.authorization;
    try {
        if (!token) {
            return res.status(401).json({
                message: "Token not found"
            });
        }
        const decode: any = jwt.verify(token, jwt_secret);
        const userId = decode.userId;
        const orgId = decode.orgId;
        const userData = await Admin_GHOST.findOne({
            _id: orgId,
            user: {
                $elemMatch: {
                    _id: userId
                }
            }
        },
            {
                'user.$': 1
            }
        );
        if (!userData) {
            return res.status(403).json({
                message: "User not found"
            });
        }
        const userName = userData?.user[0].name
        const userRole = userData?.user[0].role
        const email = userData?.user[0].email

        let { src, contentAPI, adminAPI, imageKitPublic, imageKitPrivate, imageKitUrl } = userData
        req.userId = userId;
        req.orgId = orgId;
        req.userRole = userRole;
        req.userName = userName;
        req.email = email
        req.src = src
        req.contentAPI = contentAPI
        req.adminAPI = adminAPI
        req.imageKitPublic = imageKitPublic
        req.imageKitPrivate = imageKitPrivate
        req.imageKitUrl = imageKitUrl
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid Token"
        });
    }
}

export default middleware;
