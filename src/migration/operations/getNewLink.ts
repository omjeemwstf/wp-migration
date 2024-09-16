import axios from "axios";
import path from "path"
import fs from "fs"
import uploadDataToGhost from "./uploadDataToGhost";

async function downloadContent(url: string, filepath: string) {
    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream'
        });

        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            writer.on('error', reject);
            writer.on('finish', resolve);
        });
        return filepath;
    } catch (error: any) {
        throw new Error(`Failed to download image from ${url}: ${error.message}`);
    }
}

async function getNewLink(slug: string, sourceURL: string) {
    try {
        const dataFilename = `${slug}${path.extname(sourceURL)}`;
        const dataFolderPath = path.resolve(__dirname, '.', 'data');
        if (!fs.existsSync(dataFolderPath)) {
            fs.mkdirSync(dataFolderPath);
        }
        const dataFilePath = path.resolve(__dirname, '.', 'data', dataFilename);
        const downloadedData = await downloadContent(sourceURL, dataFilePath);
        const uploadDataResponse = await uploadDataToGhost(dataFilePath)
        fs.unlinkSync(downloadedData)
        return uploadDataResponse
    } catch (err) {
        return null
    }
}

export default getNewLink
