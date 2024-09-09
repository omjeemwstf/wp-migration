import convertToISOString from "./convertToIso";
import decodeContent from "./decodeContent";
import extractCategory from "./extractCategory"
import getNewLink from "./getNewLink"
import { htmlToLexical } from "@tryghost/kg-html-to-lexical";
import changeURL from "./changeURL";
import { ghostURL } from "./config";


async function createPayLoad(data: any) {
    const tag = extractCategory(data.link)
    let newImgUrl = null
    try {
        const imgUrl = data._embedded['wp:featuredmedia'][0].source_url
        newImgUrl = await getNewLink(data.slug, imgUrl)
    } catch (err: any) {
    }
    const htmlString = data.content.rendered
    const lexicalDataObject = await htmlToLexical(htmlString);
    await changeURL(lexicalDataObject.root, ghostURL, data.slug)
    const lexicalData = JSON.stringify(lexicalDataObject);

    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    // console.log(data.link)
    // console.log(decodeContent(data.title.rendered))
    // const prompt =  decodeContent(htmlString)
    // console.log(prompt)

    let excerpt = decodeContent(data.excerpt.rendered) || ""
    if (excerpt.length > 300) {
        excerpt = excerpt.substring(0, 300);
    }

    const payload = {
        status: "published",
        title: decodeContent(data.title.rendered),
        slug: data.slug,
        url: data.link,
        tags: [tag],
        custom_excerpt: excerpt,
        lexical: lexicalData,
        feature_image: newImgUrl,
        published_at: convertToISOString(data.date),
    };
    return payload
}

export default createPayLoad