const isValidUrl = (string) => {
    try {
        return Boolean(new URL(string));
    } catch (_) {
        return false;
    }
};

export default isValidUrl;