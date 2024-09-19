import { Response } from "express";
import {  CustomMiddlewareRequest, USER_TYPES } from "../data/config";

async function migrationMiddleware(req: CustomMiddlewareRequest, res: Response, next: Function) {
    const userRole = req.userRole
    if (userRole === USER_TYPES.ADMIN) {
        next()
    } else {
        return res.status(404).json({
            message: "You are not authorized to Migration section"
        })
    }
}

export default migrationMiddleware;
