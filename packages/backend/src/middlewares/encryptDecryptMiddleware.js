const CryptoJS = require("crypto-js");

const SECRET_KEY = CryptoJS.enc.Utf8.parse(process.env.CRYPTO_SECRET_KEY);
console.log(SECRET_KEY);

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
    console.log("=== ENCRYPTION DEBUG ===");
    console.log("Backend CRYPTO_SECRET_KEY:", process.env.CRYPTO_SECRET_KEY ? process.env.CRYPTO_SECRET_KEY.substring(0, 20) + "..." : "UNDEFINED");
    console.log("Request body:", JSON.stringify(req.body).substring(0, 200));
    
    if (req.body.encryptedData) {
        console.log("Encrypted data received:", req.body.encryptedData.substring(0, 50) + "...");
        try {
            const decryptedBody = decryptData(req.body.encryptedData);
            if (!decryptedBody) {
                return res.status(400).json({ message: "Invalid encrypted data" });
            }
            req.body = decryptedBody;
            console.log("Decryption successful!");
        } catch (error) {
            console.error("Decryption failed:", error.message);
            return res.status(400).json({ message: "Decryption failed", error: error.message });
        }
    } else {
        console.log("No encryptedData in request body");
    }

    const originalSend = res.json;
    res.json = (data) => {
        const encryptedResponse = encryptData(data);
        originalSend.call(res, { encryptedData: encryptedResponse });
    };

    next();
};

module.exports = encryptDecryptMiddleware;