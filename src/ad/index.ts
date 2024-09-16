import express from "express"
import multer from 'multer';
import { imagekit } from "../config";
import { Ad } from "../schema";

const adRouter = express.Router()
const upload = multer({ storage: multer.memoryStorage() });

adRouter.post("/upload", upload.single('ad-image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
        });
        const adType = req.body.type
        const adURL = req.body.url
        const adName = req.body.adName;

        const resposne = await Ad.create({
            type: adType,
            url: adURL,
            src: result.url,
            adName: adName
        })
        console.log("Ad upload successfully..", result.url)
        res.json({ url: result.url, response: resposne });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
})

adRouter.get("/:type", async (req, res) => {
    const adType = req.params.type
    const response = await Ad.find({
        type: adType
    })
    return res.json({
        ads: response
    })
})

adRouter.delete("/:id", async (req, res) => {
    const adID = req.params.id
    const response = await Ad.deleteOne({
        _id: adID
    })
    return res.json({
        response
    })
})


export default adRouter