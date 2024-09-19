import convertToISOString from "./convertToIso";
import decodeContent from "./decodeContent";
import extractCategory from "./extractCategory"
import getNewLink from "./getNewLink"
import { htmlToLexical } from "@tryghost/kg-html-to-lexical";
import changeURL from "./changeURL";
import { ghostURL } from "../../data/config";
import generateImageFromAi from "./generateFromAi";
import decodeToPlainText from "./decodeToPlainText";


async function createPayLoad(data: any) {
    const tag = extractCategory(data.link)
    const htmlString = data.content.rendered
    const slug = data.slug;
    const imageSlug = slug.length > 40 ? slug.slice(0, 40) : slug;
    let excerpt = decodeContent(data.excerpt.rendered) || ""
    if (excerpt.length > 300) {
        excerpt = excerpt.substring(0, 300);
    }
    console.log(imageSlug)

    let newImgUrl = null
    try {
        const imgUrl = data._embedded['wp:featuredmedia'][0].source_url
        newImgUrl = await getNewLink(imageSlug, imgUrl)
    } catch (err: any) {
        const title = decodeContent(data.title.rendered) || ""
        const content = decodeToPlainText(htmlString) || ""
        newImgUrl = await generateImageFromAi(imageSlug, title, excerpt, content)
    }

    const lexicalDataObject = await htmlToLexical(htmlString);
    await changeURL(lexicalDataObject.root, ghostURL, imageSlug)
    const lexicalData = JSON.stringify(lexicalDataObject);

    const payload = {
        status: "published",
        title: decodeContent(data.title.rendered),
        slug: slug,
        url: data.link,
        tags: [tag],
        custom_excerpt: excerpt,
        lexical: lexicalData,
        feature_image: newImgUrl,
        // published_at: convertToISOString(data.date),
    };
    return payload
}

export default createPayLoad