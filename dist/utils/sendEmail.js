"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (data) => {
    // 1) destruction Data
    const { email, subject, message } = data;
    // 2) Create Transporter 
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    // 3) Define Email Options (Like From, To, Subject, Email Content)
    const mailOption = {
        from: '"Reuseable Store" <eslamgalal0312@gmail.com>',
        to: email,
        subject: subject,
        text: message,
    };
    // 4) Send Email
    await transporter.sendMail(mailOption);
};
exports.sendEmail = sendEmail;
