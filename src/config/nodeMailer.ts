import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()


const config = () => {

    console.log(process.env.SMPT_HOST)
    return {
        host: process.env.SMPT_HOST,
        port: +process.env.SMPT_PORT,
        auth: {
            user: process.env.SMPT_USER,
            pass: process.env.SMPT_PASS

        }
    }
}

export const transporter=nodemailer.createTransport(config())