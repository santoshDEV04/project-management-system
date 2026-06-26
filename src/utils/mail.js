import Mailgen from "mailgen"
import nodemailer from "nodemailer"

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanagerlink.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHtml = mailGenerator.generate(options.mailgenContent)


    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST ,
        port: process.env.MAILTRAP_SMTP_PORT ,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        }
    })

    const mail = {
        form: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }


    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file.")
        console.error("Error: ", error)
    }
}


const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our App! we're exited to have you on board. ",
            action: {
                instructions: "To verify your email please click on the following button.",
                button: {
                    color: "rgba(21, 255, 0, 0.8)",
                    text: "Verify your email",
                    link: verificationUrl
                }
            },
            outro: "Need help, or  have questions? Just reply to this email, we'd love to help"
        }
    }
}


const forgetPasswordMailgenContent = (username, password) => {
    return {
        body: {
            name: username,
            intro: "we got a request to reset the password of your account. ",
            action: {
                instructions: "To reset your passsword click on the following buttn or link",
                button: {
                    color: "rgba(91, 187, 82, 0.8)",
                    text: "Reset password",
                    link: paswordResetUrl
                }
            },
            outro: "Need help, or  have questions? Just reply to this email, we'd love to help"
        }
    }
}

export { emailVerificationMailgenContent, forgetPasswordMailgenContent, sendEmail }