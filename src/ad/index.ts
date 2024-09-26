import express from "express"
import multer from 'multer';
import { CustomMiddlewareRequest, imagekit } from "../data/config";
import middleware from "../middlewares/middleware";
import { Admin_GHOST } from "../data/schema";
import adMiddleware from "../middlewares/adMiddleware";

const adRouter = express.Router()
const upload = multer({ storage: multer.memoryStorage() });


adRouter.post("/upload", middleware, adMiddleware, upload.single('ad-image'), async (req: CustomMiddlewareRequest, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
        });

        console.log("ad body is ", req.body)
        const adType = req.body.type
        const adSrc = req.body.url
        const adName = req.body.name;

        const adURL = result.url
        const response = await Admin_GHOST.findOneAndUpdate(
            { _id: req.orgId },
            {
                $push: {
                    ad: {
                        type: adType,
                        url: adURL,
                        src: adSrc,
                        name: adName
                    }
                }
            },
            {
                new: true
            }
        );
        const ad = response?.ad
        return res.json({
            message: "Ad Uploaded Successfully..",
            ad
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
})

adRouter.get("/", middleware, async (req: CustomMiddlewareRequest, res) => {
    try {
        const orgId = req.orgId
        const response = await Admin_GHOST.findOne({ _id: orgId })
        const ads = response?.ad
        return res.json({
            ads: ads
        })
    } catch (err) {
        return res.status(401).json({
            message: "Internal Server Error"
        })
    }
})

adRouter.get("/:type", async (req: CustomMiddlewareRequest, res) => {
    try {
        const adType = req.params.type
        const orgId = req.orgId
        const response = await Admin_GHOST.findOne({ _id: orgId })
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

adRouter.delete("/:id", middleware, adMiddleware, async (req: CustomMiddlewareRequest, res) => {
    const adID = req.params.id
    try {
        const response = await Admin_GHOST.findOneAndUpdate({
            _id: req.orgId,
        },
            {
                $pull: {
                    ad: {
                        _id: adID
                    }
                }
            },
            {
                new: true,
                fields: { 'user': 0 }
            }
        )
        const ad = response?.ad
        return res.json({
            message: "Ad deleted successfully!",
            ad
        })
    } catch (err) {
        console.log("Error while deleting the ads", err)
        return res.status(400).json({
            message: "Internal Server Error"
        })
    }

})

export default adRouter