import { Resend } from 'resend';
import {OTP_EMAIL_HTML,ACK_EMAIL_HTML} from "../constants/constant.js"

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOtp = async (email,name) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const otp = generateOtp();

    try {
        const { data, error } = await resend.emails.send({
            from: "DigiSir <noreply@hellodigisir.in>",
            to: [`${email}`],
            subject: "Verification OTP",
            html: OTP_EMAIL_HTML(name,otp),
          });
          
          return {data,error,otp}
    } catch (error) {
        return { success: false, message: 'Failed to send OTP.' };
    }
}

const sendAck = async (instituteName,email,contact_number,address,logo,student_key,teacher_key,parent_key) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
        const { data, error } = await resend.emails.send({
            from: "DigiSir <noreply@hellodigisir.in>",
            to: [`${email}`],
            subject: "Payment Acknowledgement",
            html: ACK_EMAIL_HTML(instituteName,email,contact_number,address,logo,student_key,teacher_key,parent_key)
          });

          return {data,error}
    } catch (error) {
        return { success: false, message: 'Failed to send OTP.' };
    }
}




export {sendOtp,sendAck}