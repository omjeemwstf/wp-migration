import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import {  User } from "./schema"
import jwt from "jsonwebtoken"
import { jwt_secret } from "./config"
import { middleware } from "./middleware"
import postDataRouter from "./migration"
import adRouter from "./ad"
import authRouter from "./auth"

dotenv.config()
const app = express()
app.use(cors({ origin: "*" }))
app.use(express.json({ limit: '1mb' }));


app.use("/post", postDataRouter)
app.use("/ad", adRouter)
app.use("/auth", authRouter)


app.post("/isValid", async (req, res) => {
    const token = req.headers.authorization || ""
    try {
        const decode: any = jwt.verify(token, jwt_secret);
        return res.json({
            message: "Valid user"
        })
    } catch (err: any) {
        return res.status(403).json({
            message: "InValid user"
        })
    }
})

app.post("/create", async (req, res) => {
    const user = new User({ email: "om@gmail.com", password: "123" })
    const resposne = await user.save();
    return res.json({
        resposne
    })
})




app.get("/", (req, res) => {
    return res.json({
        message: "Welcome to ghost custom server..."
    })
})



const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})