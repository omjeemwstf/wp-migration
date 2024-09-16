function extractCategory(url: string) {
    const regex = /https?:\/\/[^/]+\/([^/]+)\//;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

export default extractCategory

