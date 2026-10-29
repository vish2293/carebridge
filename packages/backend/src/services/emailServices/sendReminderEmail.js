
const { createTransporter } = require('./transPorter')
const { sendReminderTemplate } = require('./template')

const sendReminderEmail = async (item) => {
    try {
        const template=sendReminderTemplate(item)
        const transporter = createTransporter;
         await transporter.sendMail({
            from: `"Bread of life"`,
            to: item?.assign_to?.email,
            subject: `Reminder`,            
            html: template
        })

    } catch (error) {
        console.log('err', error)
    }

}
module.exports = { sendReminderEmail }