import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

export const sendEmail = async(to, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject: "Reset Password",
            html: `<p>Your password reset OTP is: <b>${otp}</b>. It expires in 5 minutes.</p>`
        })
    } catch (error) {
        console.error("Mail Error:", error.message)
        throw error
    }
}