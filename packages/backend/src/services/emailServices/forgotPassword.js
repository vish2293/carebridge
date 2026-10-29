
const { createTransporter } = require('./transPorter')
const { forgetPasswordTemplate } = require('./template')
const jwt = require("jsonwebtoken")

const forgetPasswordMail = async (item, token) => {
    try {
        const template = forgetPasswordTemplate(item, token)
        const transporter = createTransporter;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: (item?.email).trim(),
            subject: `Reset Your Password`,
            html: template
        })
    } catch (error) {
        console.log('err', error)
    }

}
module.exports = { forgetPasswordMail }