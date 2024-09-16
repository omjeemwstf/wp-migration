import axios from "axios";
import { btcWiresApiUrl, ghostAPIURL, token } from "../config";
import createPayLoad from "./operations/createPayLoad";


let page = 0;
let startingPostNumber = 0;
let totalPages = 0;

async function migrateToGhost(data: any, page: number) {
    for (let i = 0; i < data.length; i++) {
        if (i >= startingPostNumber) {
            const postData = data[i]
            const payload = await createPayLoad(postData);
            try {
                const feedData = await axios.post(ghostAPIURL, { posts: [payload] }, {
                    headers: {
                        Authorization: `Ghost ${token()}`
                    }
                });
                console.log("Post published successfully! of page", page, "post no", i, "Post Secquence", (page - 1) * 10 + i + 1);
            } catch (err: any) {
                console.log(`Error while publishing post:  ${i}  Error is  ${err}`);
            }
        }
    }
    startingPostNumber = 0;
}

async function migrateWordPressData(startingPage: number, startingPost: number) {
    page = startingPage;
    startingPostNumber = startingPost;

    const response = await axios.get(`${btcWiresApiUrl}`);
    if (response && response.headers && typeof response.headers.get === 'function') {
        const headerValue = response.headers.get('X-WP-TotalPages');
        if (typeof headerValue === 'string') {
            totalPages = parseInt(headerValue, 10);
        } else {
            totalPages = 10;
        }
    }
    try {
        do {
            const response = await axios.get(`${btcWiresApiUrl}page=${page}`);
            await migrateToGhost(response.data, page)
            page++;
        } while (page <= totalPages);
        console.log("All posts migrated successfully!.....")

    } catch (error) {
        throw new Error(`Error while fetching posts from wordpress of page  ${page} Error is  ${error}`);
    }
}


export default migrateWordPressData

