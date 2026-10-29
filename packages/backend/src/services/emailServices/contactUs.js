
const { createTransporter } = require('./transPorter')
const { contactUsTemplate } = require('./template')

const contactUsMailTemp = async (item, contactData) => {
    try {
        const template=contactUsTemplate(item, contactData)
        const transporter = createTransporter;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.CONTACT_MAIL,
            subject: `New Contact Message - ${contactData.fullName}`,            
            html:template
        })
    } catch (error) {
        console.log('err', error)
    }
}
module.exports = { contactUsMailTemp }