const crypto = require("crypto");

const generateOTP = (userId) => {
    const data = `${userId.toString()}-${Date.now()}`;

    const hash = crypto.createHash("sha256").update(data).digest("hex");
    const otp = parseInt(hash.substring(0, 6), 16) % 1000000; 

    return otp.toString().padStart(6, "0"); 
};

module.exports = {
    generateOTP
}