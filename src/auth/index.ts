import express from "express"
import jwt from "jsonwebtoken"
import { AdminUsers, User } from "../schema"
import { jwt_secret } from "../config"

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
    const isUserExist = await User.findOne({ email, password })
    if (!isUserExist) {
        return res.status(404).json({
            message: "User is not authentic"
        })
    }
    const token = jwt.sign({ userId: isUserExist._id }, jwt_secret);

    return res.json({
        token
    })
})

authRouter.post("/user", async (req, res) => {
    const body = req.body;
    try {
        const name = body.name
        const role = body.role

        const adminUser = new AdminUsers({ name: name, role: role });
        const resposne = await adminUser.save();
        return res.json({
            adminUser: resposne
        })
    } catch (Err: any) {
        return res.status(400).json({
            error: Err
        })
    }
})

authRouter.get("/user", async (req, res) => {
    const response = await AdminUsers.find();
    return res.json({
        response
    })
})

export default authRouter