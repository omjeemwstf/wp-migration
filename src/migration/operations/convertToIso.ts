function convertToISOString(dateString: string) {
    const date = new Date(dateString);
    const isoString = date.toISOString();
    return isoString;
}

export default convertToISOString