import { Response } from "express";
import { CustomMiddlewareRequest, USER_TYPES } from "../data/config";
import { Admin_GHOST } from "../data/schema";

async function adminMiddleware(req: CustomMiddlewareRequest, res: Response, next: Function) {
    const userRole = req.userRole
    if (userRole === USER_TYPES.ADMIN) {
        const orgData = await Admin_GHOST.findOne({
            _id: req.orgId
        })
        next()
    } else {
        return res.status(401).json({
            message: "You are not authorized to Admin section"
        })
    }
}

export default adminMiddleware;
