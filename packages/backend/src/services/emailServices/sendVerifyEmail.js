
const { createTransporter } = require('./transPorter')
const {  sendVerifyEmaleTemplate } = require('./template')

const sendVerifyEmale = async (item) => {
    try {
        const template=sendVerifyEmaleTemplate(item)
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

module.exports = { sendVerifyEmale }