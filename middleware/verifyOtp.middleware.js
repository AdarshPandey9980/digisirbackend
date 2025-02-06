import {sendOtp} from "../utils/resentEmailService.utils.js"

const sendOtpToEmail = async (req,res,next) => {
    try {
        const {email,name} = req.body

        if (!email || !name) {
            return res.status(400).json({message:"email and name is requied"})
        }
        
        const {otp,data,error} = await sendOtp(email,name)
        
        if (error) {
            return res.status(400).json({message:"failed to send otp"})
        }
        
        return res.status(200).json({message:"otp send successfully"})

    } catch (error) {
        return res.status(500).json({message:"failed to send otp",otp})
    }
}


const verifyOtp = async (req,res) => {
    try {
        const {userotp} = req.body
        const {otp} = req.body
        console.log(otp);

        if (!userotp) {
            return res.status(300).json({message:"user otp is required"})
        }

        if (userotp === otp) {
           return res.status(200).json({message:"otp verifyed"})
        }  else {
            return res.status(300).json({message:"incorrect otp"})
        }

    } catch (error) {
        return res.status(500).json({message:"failed to verify otp"})
    }
} 

export {sendOtpToEmail,verifyOtp}
