import getNewLink from "./getNewLink";

async function changeHostAndProtocol(child: any, target: string, slug: string) {
    if (child && child.type === 'link') {
        let urlString: string = child.url.replace(' ', '');
        const isContains = urlString.includes("wp-content")
        if (isContains) {
            if (urlString.endsWith(".pdf")) {
                const newLink = await getNewLink(slug, urlString)
                child.url = newLink
            }
            else{
                const newLink = await getNewLink(slug, urlString)
                child.url = newLink
            }
        }
    }
}

async function changeURL(data: any, target: string, slug: string) {
    await changeHostAndProtocol(data, target, slug);
    if (data && data.children) {
        for (const child of data.children) {
            await changeURL(child, target, slug);
        }
    }
}

export default changeURL
