export const DB_NAME = "digisir"

export const OTP_EMAIL_HTML = (name,otp) => (`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            color: #4caf50;
            font-size: 24px;
            margin: 0;
        }
        .message {
            margin-top: 20px;
            font-size: 16px;
            color: #333333;
            line-height: 1.5;
        }
        .otp {
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            background-color: #4caf50;
            padding: 10px 20px;
            margin: 20px 0;
            border-radius: 4px;
            text-decoration: none;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>OTP Verification</h1>
        </div>
        <div class="message">
            <p>Hello, ${name}</p>
            <p>Your One-Time Password (OTP) for digisir verification is:</p>
            <p class="otp">${otp}</p>
            <p>This OTP is valid for the next 5 minutes. Please do not share it with anyone.</p>
        </div>
        <div class="footer">
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>&copy; 2025 digisir. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`)