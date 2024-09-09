import he from "he"
import { JSDOM } from "jsdom"


function decodeContent(data: string) {
    let decoded = he.decode(data);
    const dom = new JSDOM(decoded)
    const textContent = dom.window.document.body.textContent;
    return textContent
    // const trimmed = textContent?.replace(/\s{2,}/g," ")
    // return trimmed?.trim()
}

export default decodeContent