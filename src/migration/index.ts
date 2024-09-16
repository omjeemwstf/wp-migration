import express from "express"
import migrateWordPressData from "./fetch";
import decodeToPlainText from "./operations/decodeToPlainText";
import updatePostWithFeatureImage from "./operations/postPublished";

const postDataRouter = express.Router()
let isMigrating = false

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

export default postDataRouter