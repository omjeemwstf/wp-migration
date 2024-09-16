import FormData from "form-data";
import fs from "fs"
import path from "path"
import axios from "axios"

import { token, uploadToGhostFilesUrl } from "../../config";

async function uploadDataToGhost(filepath: string) {
    const contentData = fs.createReadStream(filepath);
    const formData = new FormData();

    formData.append('file', contentData, path.basename(filepath));

    try {
        const response = await axios.post(uploadToGhostFilesUrl, formData, {
            headers: {
                Authorization: `Ghost ${token()}`,
                ...formData.getHeaders(),
            }
        });
        return response.data.files[0].url;
    } catch (error: any) {
        throw new Error(`Failed to upload image to Ghost: ${error.message}`);
    }
}

export default uploadDataToGhost