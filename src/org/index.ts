import express from "express"
import { Admin_GHOST } from "../data/schema";
import { CustomMiddlewareRequest, USER_TYPES } from "../data/config";

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
        const response = await Admin_GHOST.findOne({src: origin})
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


export default orgInfoRouter