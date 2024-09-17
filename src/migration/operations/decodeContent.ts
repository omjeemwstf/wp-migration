import he from "he"
import { JSDOM } from "jsdom"


function decodeContent(data: string) {
    let decoded = he.decode(data);
    const dom = new JSDOM(decoded)
    const textContent = dom.window.document.body.textContent;
    return textContent
}

export default decodeContent