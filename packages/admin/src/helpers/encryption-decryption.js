import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_APP_CRYPTO_SECRET_KEY; // Store this securely, e.g., in environment variables

// DEBUG: Log the key being used (remove in production)
console.log("=== FRONTEND ENCRYPTION DEBUG ===");
console.log("VITE_APP_CRYPTO_SECRET_KEY:", SECRET_KEY ? SECRET_KEY.substring(0, 20) + "..." : "UNDEFINED");
console.log("Key length:", SECRET_KEY ? SECRET_KEY.length : 0);

// Function to encrypt data
export const encryptData = (data) => {
	console.log("Encrypting data:", JSON.stringify(data).substring(0, 50));
	const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
	console.log("Encrypted result:", encrypted.substring(0, 50) + "...");
	return encrypted;
};

// Function to decrypt data
export const decryptData = (encryptedData) => {
	const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};
