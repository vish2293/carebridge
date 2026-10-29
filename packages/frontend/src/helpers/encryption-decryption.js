import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_APP_CRYPTO_SECRET_KEY; // Store this securely, e.g., in environment variables

// Function to encrypt data
export const encryptData = (data) => {
	const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
	return encrypted;
};

// Function to decrypt data
export const decryptData = (encryptedData) => {
	const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};
