const sendReminderTemplate = (item) => {
    return `<div>
                    <h1>Hello ${item?.assign_to?.firstName}</h1>
                    <p>Here is reminder for your ${item?.todo}</p>
            </div>`
}

const sendVerifyEmaleTemplate = (item) => {
    return `<div>
                    <h1>Hello ${item?.firstName}</h1>
                    <p>Please click  here <a href="${process.env.CURRENT_URL}/verify/${item?._id}">Verify</a> to verify your email</p>
            </div>`
}

const sendVerifyEmailChangeEmailTemplate = (item) => {
    return ` <div>
                <h2>Hello ${item?.firstName},</h2>
                <p>You've requested to change your email address from ${item?.email} to ${item?.tempEmail}. To complete the process, please verify your new email address by clicking the link below:</p>
                <p><a href="${process.env.CURRENT_URL}/verify-email/${item?.changeMailMetaKey}" target="_blank">Verify New Email</a></p>
                <p>If you did not make this request, please ignore this email.</p>
                <p>Thank you for using Sample Project.</p>
                <p>Best regards,<br>Sample Project Team</p>
            </div>`
}

const forgetPasswordTemplate = (item, token) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="text-align: center; color: #3B82F6;">Reset Your Password</h2>
            <p style="font-weight: bold;">Hello ${item?.firstName} ${item?.lastName},</p>
            <p>You recently requested to reset your password for your account. To proceed with resetting your password, please click the link below:</p>
            <p style="text-align: center;">
                <a href="${process.env.CURRENT_URL}/reset-password/${item?._id}?token=${token}" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </p>
            <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>For your security, this link will expire in 24 hours.</p>
            <h3 style="color: #3B82F6;">Security Tips:</h3>
            <ul style="padding-left: 20px;">
                <li>Use a unique password that you don't use for any other accounts.</li>
                <li>Include a mix of letters, numbers, and special characters in your password.</li>
                <li>Avoid using easily guessable information such as your name, birthdate, or common words.</li>
            </ul>
            <p>If you have any questions or need further assistance, please contact our support team at <a href="mailto:support@sampleproject.demo" style="color: #3B82F6;">support@sampleproject.demo</a></p>
            <p>Thank you!</p>
            <p>Best regards,</p>
            <p>The Sample Project Team</p>
            <hr>
            <p style="font-size: 12px; color: #888;">
                If you did not request this password reset, it is possible that someone else has entered your email address by mistake. If you believe this is the case, please secure your account by changing your password immediately and contacting support.
            </p>
        </div>
    `;
};

const contactUsTemplate = (item, contactData) => {
    return `<div>
        <h1>Hi ${item?.firstName + ` ` + item?.lastName} </h1>
        <p>You've received a new message from a visitor:</p>
        <p>Name: ${contactData.fullName}</p>
        <p>Email: ${contactData.email}</p>
        <p>Message: ${contactData.message}</p>
        <p>Description: ${contactData.description}</p>
        <p>Please respond promptly.</p>
        <p>Best Regards,</p>
        <p>Sample Project</p>
    </div>`
}

const reminderTemplate = (item, data, dueDate) => {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    return `<div>
        <h1>Dear ${data?.firstName + ` ` + data?.lastName} ,</h1>
        <p>You've received a new message for reminder that you have an ${item?.task_name} scheduled for ${dueDate.toLocaleString('en-US', options)}.</p>
        <h3>Next steps Details:</h3>
        <p>Name: ${item?.task_name}</p>
        <p>Description: ${item?.task_description}</p>
        <p>Best Regards,</p>
        <p>Sample Project</p>
    </div>`
}

const multiFactorAuthTemplate = (item, otp) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="text-align: center; color: #3B82F6;">Your One-Time Password (OTP)</h2>
            <p style="font-weight: bold;">Hello ${item?.firstName} ${item?.lastName},</p>
            <p>To complete your authentication process, please use the following One-Time Password (OTP):</p>
            <p style="text-align: center; font-size: 24px; font-weight: bold; color: #3B82F6; background: #f8fafc; padding: 10px; border-radius: 8px; letter-spacing: 2px;">${otp}</p>
            <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
            <h3 style="color: #3B82F6;">Security Tips:</h3>
            <ul style="padding-left: 20px;">
                <li>Never share your OTP with anyone, including support representatives.</li>
                <li>If you did not request this OTP, please secure your account immediately.</li>
                <li>Ensure you enable Two-Factor Authentication (2FA) for added security.</li>
            </ul>
            <p>If you have any questions or need further assistance, please contact our support team at 
                <a href="mailto:support@sampleproject.demo" style="color: #3B82F6;">support@sampleproject.demo</a>
            </p>
            <p>Thank you!</p>
            <p>Best regards,</p>
            <p>The Sample Project Team</p>
            <hr>
            <p style="font-size: 12px; color: #888;">
                If you did not request this OTP, it is possible that someone else has entered your email address by mistake. 
                Please secure your account by changing your password and contacting support if necessary.
            </p>
        </div>
    `;
};


module.exports = { sendReminderTemplate, sendVerifyEmaleTemplate, forgetPasswordTemplate, contactUsTemplate, sendVerifyEmailChangeEmailTemplate, reminderTemplate, multiFactorAuthTemplate }