import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { jwt_secret } from "./data/config"
import postDataRouter from "./migration"
import adRouter from "./ad"
import authRouter from "./auth"
import axios from "axios"
import generateImageFromAi from "./migration/operations/generateFromAi"
import orgInfoRouter from "./org"

dotenv.config()
const app = express()
app.use(cors({ origin: "*" }))
app.use(express.json({ limit: '1mb' }));


app.use("/post", postDataRouter)
app.use("/ad", adRouter)
app.use("/auth", authRouter)
app.use("/org", orgInfoRouter)

app.put("/:postId", async (req, res) => {

    const postId = req.params.postId;
    const response = await axios.get(`/${postId}/?key=2ea1717d19a2410c608bf0b5d4`);
    const data = response.data.posts[0]
    let { id, title, html, slug, custom_excerpt, updated_at } = data
    console.log(id)
    console.log(title)
    console.log(slug)
    console.log(custom_excerpt)
    console.log(updated_at)
     
    return res.json({

    })
})

app.get("/", (req, res) => {
    const origin = req.get('origin') || req.get('referer') || 'Unknown';
    console.log("Request origin:", req.get('origin'));

    return res.json({
        message: "Welcome to ghost custom server...",
        origin: origin
    });
});



const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})