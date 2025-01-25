import { Resend } from 'resend';
import {generateTokenForOtp} from "./index.utils.js"
import {OTP_EMAIL_HTML} from "../constants/constant.js"

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOtp = async (email,name) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

//   resend.domains.verify('0af90700-4f3e-441d-ae64-cc8cfcb5ec9d');

    const otp = generateOtp();
    const expiry = Date.now() + 5 * 60 * 1000; 

    const token = await generateTokenForOtp(otp,expiry)

    try {
        const { data, error } = await resend.emails.send({
            from: "DigiSir <noreply@hellodigisir.in>",
            to: [`${email}`],
            subject: "Verification OTP",
            html: OTP_EMAIL_HTML(name,otp),
          });

          return {data,error,token,otp}
    } catch (error) {
        return { success: false, message: 'Failed to send OTP.' };
    }
}

export {sendOtp}