
const { createTransporter } = require('./transPorter')
const { multiFactorAuthTemplate } = require('./template')

const multiFactorEmail = async (item, token) => {
    try {
        const template = multiFactorAuthTemplate(item, token)
        const transporter = createTransporter;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: (item?.email).trim(),
            subject: `Your One-Time Password (OTP) for Secure Login`,
            html: template
        })
    } catch (error) {
        console.log('err', error)
    }

}
module.exports = { multiFactorEmail }