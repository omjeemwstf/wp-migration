import express from "express"
import jwt from "jsonwebtoken"
import { CustomMiddlewareRequest, jwt_secret } from "../data/config"
import { Admin_GHOST } from "../data/schema"
import middleware from "../middlewares/middleware"

const authRouter = express.Router()

authRouter.post("/signin", async (req, res) => {
    const body = req.body
    const email = body.email
    const password = body.password
    if (!email || !password) {
        return res.status(404).json({
            message: "Please enter email and password"
        })
    }
    const srcName = req.get('origin') || req.get('referer') || 'Unknown';

    const isUserExist = await Admin_GHOST.findOne(
        {
            src: srcName,
            user: {
                $elemMatch: {
                    email, password
                }
            }
        },
        { 'user.$': 1 }
    )
    if (!isUserExist) {
        return res.status(404).json({
            message: "User is not authentic"
        })
    }
    const orgId = isUserExist._id
    const userId = isUserExist.user[0]._id

    const token = jwt.sign({
        orgId: orgId,
        userId: userId,
    }, jwt_secret)

    return res.json({
        message: "User exist",
        token
    })
})

authRouter.post("/signup", async (req, res) => {
    const body = req.body
    const email = body.email
    const password = body.password
    const srcName = req.get('origin') || req.get('referer') || 'Unknown';
    if (!email || !password) {
        return res.status(404).json({
            message: "Please enter email and password"
        })
    }
    const isUserExist = await Admin_GHOST.findOne(
        {
            src: srcName,
            user: {
                $elemMatch: {
                    email: email
                }
            }
        }
    )
    if (isUserExist) {
        return res.status(404).json({
            message: "Email already in Use"
        })
    }
    try {
        const createUser = await Admin_GHOST.findOneAndUpdate(
            { src: srcName },
            {
                $push: {
                    user: { email, password }
                }
            },
            {
                new: true,
                fields: { 'user': { $slice: -1 } }
            }
        )
        if (!createUser) {
            return res.status(404).json({
                message: "Organization is not registered"
            })
        }
        console.log("create user", createUser)
        const token = jwt.sign({
            orgId: createUser?._id,
            userId: createUser?.user[0]._id
        }, jwt_secret)

        return res.json({
            message: "User created",
            token
        })
    } catch (error: any) {
        console.log("Error while registering user")
        return res.status(400).json({
            message: "Error while registering user"
        })
    }
})

authRouter.get("/", middleware, async (req: CustomMiddlewareRequest, res) => {
    return res.json({
        name: req.userName,
        role: req.userRole
    })
})

export default authRouter