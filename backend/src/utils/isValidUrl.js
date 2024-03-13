const isValidUrl = (string) => {
    try {
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        return Boolean(new URL(string));
    } catch (_) {
        return false;
    }
};

export default isValidUrl;