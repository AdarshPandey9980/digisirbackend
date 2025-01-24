import {resend,generateTokenForOtp} from "./index.utils.js"
import {OTP_EMAIL_HTML} from "../constants/constant.js"


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOtp = async (email,name) => {
    const otp = generateOtp();
    const expiry = Date.now() + 5 * 60 * 1000; 

    const token = await generateTokenForOtp(otp,expiry)
    
    try {
        const { data, error } = await resend.emails.send({
            from: "DigiSir <digisir@gmail.com>",
            to: [`${email}`],
            subject: "Verification OTP",
            html: OTP_EMAIL_HTML,
          });
        
          return {data,error,token}
    } catch (error) {
        console.error('Error sending OTP:', error.response?.data || error.message);
        return { success: false, message: 'Failed to send OTP.' };
    }
}

export {sendOtp}