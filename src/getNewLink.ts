import axios from "axios";
import path from "path"
import fs from "fs"
import FormData from "form-data";

import { token, uploadToGhostFilesUrl } from "./config";

async function uploadDataToGhost(filepath: string) {
    const contentData = fs.createReadStream(filepath);
    const formData = new FormData();

    formData.append('file', contentData, path.basename(filepath));

    try {
        const response = await axios.post(uploadToGhostFilesUrl, formData, {
            headers: {
                Authorization: `Ghost ${token}`,
                ...formData.getHeaders(),
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to upload image to Ghost: ${error.message}`);
    }
}

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
        return uploadDataResponse.files[0].url
    } catch (err) {
        return null
    }
}

export default getNewLink
