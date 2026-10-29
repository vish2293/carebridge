const trimStrings = (obj) => {
    if (typeof obj === 'string') {
        return obj.trim();
    }
    if (Array.isArray(obj)) {
        return obj.map(trimStrings);
    }
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key] = trimStrings(obj[key]);
            return acc;
        }, {});
    }
    return obj;
};

module.export = {
    trimStrings
}