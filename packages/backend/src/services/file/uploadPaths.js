const getPath = (originalUrl) => {
    let path;

    path = 'community-care/attachments'

    const pathPartials = [
        [/user\/acc-settings\/profile\/profile\/update/, "img-user-profile-images"],
    ];

    return `${path}`
};
module.exports = { getPath };

