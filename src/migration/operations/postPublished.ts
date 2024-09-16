import axios from "axios";
import { ghostAPIURL, token } from "../../config";
import generateImageFromAi from "./generateFromAi";

async function updatePostWithFeatureImage(id: string, slug: string, title: string, custom_excerpt: string, html: string, updated_at: string) {
    const newImgUrl = await generateImageFromAi(slug, title, custom_excerpt, html)
    const payload = {
        feature_image: newImgUrl,
        updated_at: updated_at
    };
    try {
        const feedData = await axios.put(`${ghostAPIURL}${id}`, { posts: [payload] }, {
            headers: {
                Authorization: `Ghost ${token()}`
            }
        });
        console.log("Post Updated successfully!");
    } catch (err: any) {
        console.log(`Error while updating post: Error is  ${JSON.stringify(err.response.data)}`);
    }
}

export default updatePostWithFeatureImage;