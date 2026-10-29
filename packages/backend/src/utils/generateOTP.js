const crypto = require("crypto");

// 6-digit one-time code from a CSPRNG (the old sha256(userId + Date.now()) was guessable)
const generateOTP = () => crypto.randomInt(0, 1000000).toString().padStart(6, "0");

module.exports = {
    generateOTP
}
