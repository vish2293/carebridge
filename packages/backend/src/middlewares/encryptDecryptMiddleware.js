const CryptoJS = require("crypto-js");

const encryptData = (data) => {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_SECRET_KEY).toString();
	return encrypted;
};

const decryptData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTO_SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};

const encryptDecryptMiddleware = (req, res, next) => {
    if (req.body.encryptedData) {
        try {
            const decryptedBody = decryptData(req.body.encryptedData);
            if (!decryptedBody) {
                return res.status(400).json({ message: "Invalid encrypted data" });
            }
            req.body = decryptedBody;
        } catch (error) {
            return res.status(400).json({ message: "Decryption failed" });
        }
    }

    const originalSend = res.json;
    res.json = (data) => {
        const encryptedResponse = encryptData(data);
        originalSend.call(res, { encryptedData: encryptedResponse });
    };

    next();
};

module.exports = encryptDecryptMiddleware;