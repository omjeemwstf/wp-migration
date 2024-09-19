import axios from "axios"
import fs from "fs"
import path from "path"
import { generateImageFromAIUrl } from "../../data/config";
import uploadDataToGhost from "./uploadDataToGhost";

async function generateImageFromAi(slug: string, title: string, excerpt: string, content: string) {
    console.log("Image is generating from AI.....")
    const payLoad = {
        "blog": {
            title, excerpt, content
        }
    }
    try {
        const response = await axios.post(generateImageFromAIUrl, payLoad, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const base64Data = response.data.Generated_images.image_0;
        const buffer = Buffer.from(base64Data, 'base64');

        const dataFolderPath = path.resolve(__dirname, 'aiGenerated');
        if (!fs.existsSync(dataFolderPath)) {
            fs.mkdirSync(dataFolderPath);
        }
        const dataFilename = `${slug}.png`;
        const dataFilePath = path.resolve(dataFolderPath, dataFilename);
        fs.writeFileSync(dataFilePath, buffer);
        const imageLink = await uploadDataToGhost(dataFilePath)
        return imageLink
    } catch (Error: any) {
        console.log("Error while generatingImage from AI", Error.message)
    }

}

export default generateImageFromAi