import express from "express"
import migrateWordPressData from "./fetch";
import decodeToPlainText from "./operations/decodeToPlainText";
import updatePostWithFeatureImage from "./operations/postPublished";
import middleware from "../middlewares/middleware";
import migrationMiddleware from "../middlewares/migrationMiddleware";
import axios from "axios";
import { contentAPIKey, ghostAPIURL, ghostContentApiURL } from "../data/config";
import generateImageFromAi from "./operations/generateFromAi";

const postDataRouter = express.Router()
let isMigrating = false

postDataRouter.use(middleware, migrationMiddleware)

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


postDataRouter.put("/:postId", async (req, res) => {

    try {
        const postId = req.params.postId;
        const response = await axios.get(`${ghostContentApiURL}${postId}/?key=${contentAPIKey}`);
        let { id, title, html, slug, custom_excerpt, updated_at } = response.data.posts[0]

        const newImgUrl = await generateImageFromAi(slug, title, custom_excerpt, html)

        return res.json({
            newImageUrl: newImgUrl
        })
    } catch (Err: any) {
        return res.status(404).json({
            message: Err.message
        })
    }

})

export default postDataRouter