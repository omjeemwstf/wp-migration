import he from "he"
import { JSDOM } from "jsdom"


function decodeToPlainText(data: string) {
    // let decoded = he.decode(data);
    const dom = new JSDOM(data)
    const textContent = dom.window.document.body.textContent;
    const trimmed = textContent?.replace(/\s{2,}/g," ")
    return trimmed?.trim()
}

export default decodeToPlainText