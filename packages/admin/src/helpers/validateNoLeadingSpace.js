
export const validateNoLeadingSpace = (_, value) => {
    if (value && value.startsWith(' ')) {
        return Promise.reject(new Error('First character cannot be a space'));
    }
    return Promise.resolve();
};