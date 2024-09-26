import express from "express"
import { Admin_GHOST } from "../data/schema";
import { CustomMiddlewareRequest, USER_TYPES, ghostAPIURL, token } from "../data/config";
import axios from "axios";
import decodeContent from "../migration/operations/decodeContent";
import generateImageFromAi from "../migration/operations/generateFromAi";
import middleware from "../middlewares/middleware";
import adminMiddleware from "../middlewares/adminMiddleWare";

const orgInfoRouter = express.Router()


orgInfoRouter.post("/", async (req, res) => {
    const body = req.body
    const srcName = req.get('origin') || req.get('referer') || 'Unknown';
    try {
        let { email, password, contentApi, adminApi, secretCode, adminName, orgName } = body
        if (!email || !password || !contentApi || !adminApi || !secretCode || !adminName || !orgName) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const isOrgExist = await Admin_GHOST.findOne({ src: srcName })
        console.log(isOrgExist)
        if (isOrgExist) {
            return res.status(404).json({
                message: "Organization already registered"
            })
        }
        const createOrg = await Admin_GHOST.create({
            contentAPI: contentApi,
            adminAPI: adminApi,
            name: orgName,
            src: srcName,
            user: [
                {
                    name: adminName,
                    email: email,
                    password: password,
                    role: USER_TYPES.ADMIN
                }
            ]
        })
        return res.json({
            message: "Org Created Successfully",
            response: createOrg
        })

    } catch (Err: any) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }

})

orgInfoRouter.get("/ad/:type", async (req: CustomMiddlewareRequest, res) => {
    const origin = req.get('origin') || req.get('referer') || 'Unknown';
    try {
        const adType = req.params.type
        const response = await Admin_GHOST.findOne({ src: origin })
        const ads = response?.ad
        const filteredAds = ads?.filter((ele) => ele.type === adType);
        return res.json({
            ads: filteredAds
        })
    } catch (err) {
        return res.status(401).json({
            message: "Internal Server Error"
        })
    }
})

orgInfoRouter.get("/loadmore", async (req, res) => {
    try {
        const page = req.query.page
        const tag = req.query.tag
        const origin = req.get('origin') || req.get('referer') || 'Unknown';
        const response = await Admin_GHOST.find({
            src: origin
        })
        const data = response[0]
        const contentAPI = data.contentAPI
        const baseUrlAPI = data.src
        const allPostAPI = baseUrlAPI + `/ghost/api/content/posts/?key=${contentAPI}`;
        const loadMoreAPI = allPostAPI +
            `&fields=title,url,feature_image,published_at&include=authors,tags&page=${page}&filter=tag:${tag}`;
        const fetchData = await axios.get(loadMoreAPI)
        return res.json({
            data: fetchData.data.posts
        })
    } catch (Err) {
        return res.status(404).json({
            err: Err
        })
    }

})

orgInfoRouter.get("/img", async (req, res) => {
    try {
        const postId = req.query.postId
        const Imgtype: any = req.query.type || "Animated"
        const url = `http://localhost:2368/ghost/api/content/posts/${postId}?key=2ea1717d19a2410c608bf0b5d4&&fields=title,html,excerpt,slug`

        const response = await axios.get(url)
        const posts = response.data.posts[0]

        let title = posts.title
        let html = posts.html
        let excerpt = posts.excerpt
        let slug = posts.slug

        title = decodeContent(title)
        html = decodeContent(html)
        excerpt = decodeContent(excerpt)

        const imgLink = await generateImageFromAi(slug, title, excerpt, html, Imgtype)

        const imgUrl = new URL(imgLink)
        imgUrl.hostname = "localhost"

        return res.json({
            img: imgUrl
        })

    } catch (err) {
        console.log("Error while image generation")
        return res.status(400).json({
            message: "Error in img Generation",
            err
        })
    }

})

orgInfoRouter.post("/img", async (req, res) => {
    const body = req.body
    let imgURL = body.img
    const postId = body.id

    try {
        imgURL = new URL(imgURL)
        if (!imgURL || !postId) {
            return res.status(401).json({
                message: "Please enter valid details"
            })
        }
        console.log("Image url ", imgURL, "post id", postId)
        const url = `http://localhost:2368/ghost/api/content/posts/${postId}?key=2ea1717d19a2410c608bf0b5d4&&fields=updated_at`

        const response = await axios.get(url)
        const posts = response.data.posts[0]
        const updatedAt = posts.updated_at

        const payload = {
            feature_image: imgURL,
            updated_at: updatedAt
        };

        const feedData = await axios.put(`${ghostAPIURL}${postId}`, { posts: [payload] }, {
            headers: {
                Authorization: `Ghost ${token()}`
            }
        });
        console.log("Post Updated successfully!");
        return res.json({
            message: "Image Uploaded Successfully.."
        })

    } catch (Err) {
        return res.status(500).json({
            message: "Internal Server Error.."
        })
    }

})

interface SettingsAdmin {
    adminAPI?: string;
    contentAPI?: string;
    imageKitPublic?: string;
    imageKitPrivate?: string;
    imageKitUrl?: string;
}

orgInfoRouter.put("/setting", middleware, adminMiddleware, async (req: CustomMiddlewareRequest, res) => {
    const body = req.body
    const adminAPI = body.adminAPI
    const contentAPI = body.contentAPI
    const imageKitPublic = body.imageKitPublic
    const imageKitPrivate = body.imageKitPrivate
    const imageKitUrl = body.imageKitUrl

    const payLoad: SettingsAdmin = {}
    if (adminAPI) payLoad.adminAPI = adminAPI
    if (contentAPI) payLoad.contentAPI = contentAPI
    if (imageKitPublic) payLoad.imageKitPublic = imageKitPublic
    if (imageKitPrivate) payLoad.imageKitPrivate = imageKitPrivate
    if (imageKitUrl) payLoad.imageKitUrl = imageKitUrl

    try {
        if (Object.keys(payLoad).length > 0) {
            const response = await Admin_GHOST.findOneAndUpdate(
                {
                    _id: req.orgId
                },
                {
                    $set: payLoad
                }, {
                new: true,
                upsert: true
            }
            );
            return res.json({
                message: "Profile Updated Successfully.."
            })
        } else {
            return res.status(401).json({
                messaage: "Enter details to update",
            })
        }
    } catch (err) {
        return res.status(401).json({
            message: "Error while updating userInfo",
            error: err
        })
    }
})






export default orgInfoRouter