
import { Response } from "express";
import { CustomMiddlewareRequest, USER_TYPES } from "../data/config";


async function adMiddleware(req: CustomMiddlewareRequest, res: Response, next: Function) {
    const userRole = req.userRole
    if (userRole === USER_TYPES.ADMIN || userRole === USER_TYPES.AD_MANAGER) {
        next()
    } else {
        return res.status(401).json({
            message: "You are not authorized to Ad section"
        })
    }
}

export default adMiddleware;
