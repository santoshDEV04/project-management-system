import Mailgen from "mailgen"



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