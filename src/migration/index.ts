import express from "express"
import migrateWordPressData from "./fetch";
import decodeToPlainText from "./operations/decodeToPlainText";
import updatePostWithFeatureImage from "./operations/postPublished";
import middleware from "../middlewares/middleware";
import migrationMiddleware from "../middlewares/migrationMiddleware";
import axios from "axios";
import { CustomMiddlewareRequest, ghostAPIURL, ghostContentApiURL } from "../data/config";
import generateImageFromAi from "./operations/generateFromAi";
import adminMiddleware from "../middlewares/adminMiddleWare";

const postDataRouter = express.Router()
let isMigrating = false

postDataRouter.use(middleware)

postDataRouter.post("/migration", (req, res) => {
    isMigrating = true;
    migrateWordPressData(1, 0)
    return res.json({
        message: "Post Started migrating..."
    })
})

postDataRouter.post("/published", (req, res) => {
    if (!isMigrating) {
        let { id, title, html, slug, custom_excerpt, updated_at } = req.body.post.current
        html = decodeToPlainText(html) || ""
        title = decodeToPlainText(title) || ""
        custom_excerpt = decodeToPlainText(custom_excerpt) || ""
        slug = decodeToPlainText(slug) || ""
        updatePostWithFeatureImage(id, slug, title, custom_excerpt, html, updated_at)
    }
    return res.json({
        message: "Message recieved..."
    })
})


postDataRouter.put("/:postId", async (req: CustomMiddlewareRequest, res) => {

    try {
        const postId = req.params.postId;
        const response = await axios.get(`${ghostContentApiURL}${postId}/?key=${req.contentAPI}`);
        let { id, title, html, slug, custom_excerpt, updated_at } = response.data.posts[0]

        const newImgUrl = await generateImageFromAi(slug, title, custom_excerpt, html, "Animated")

        return res.json({
            newImageUrl: newImgUrl
        })
    } catch (Err: any) {
        return res.status(404).json({
            message: Err.message
        })
    }

})

postDataRouter.get("/", async (req: CustomMiddlewareRequest, res) => {
    const pageNo = req.query.page || 1
    try {
        const baseUrlAPI = req.src;
        const allPostAPI = baseUrlAPI + `/ghost/api/content/posts/?key=${req.contentAPI}&fields=title,url,feature_image,id&page=${pageNo}`;
        const response = await axios.get(allPostAPI)
        const posts = response.data.posts
        return res.json({
            posts
        })
    } catch (err) {
        return res.status(404).json({
            message: "Error while getting posts",
            err
        })
    }
})

export default postDataRouter