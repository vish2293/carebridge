
const { createTransporter } = require('./transPorter')
const { sendVerifyEmailChangeEmailTemplate } = require('./template')

const changeMailMetaKey = async (item) => {
    try {
        const template=sendVerifyEmailChangeEmailTemplate(item)
        const transporter = createTransporter;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: item?.email,
            subject: `Verify email`,            
            html:template
        })

    } catch (error) {
        console.log('err', error)
    }

}
module.exports = { changeMailMetaKey }