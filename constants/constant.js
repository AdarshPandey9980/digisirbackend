export const DB_NAME = "digisir";

export const OTP_EMAIL_HTML = (name, otp) => `<!DOCTYPE html>
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
</html>`;

export const ACK_EMAIL_HTML = (
  instituteName,
  email,
  contact_number,
  address,
  logo,
  student_key,
  teacher_key,
  parent_key
) =>
  `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <div style="text-align: center;">
      <img src=${logo} alt="Institute Logo" style="max-width: 100px; margin-bottom: 20px;" />
    </div>
    <h2 style="color: #333; text-align: center;">Welcome to Our Digisir Platform</h2>
    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      Dear <b>${instituteName}</b>,
    </p>
    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      We are excited to have you join our platform! Below are the details of your registration:
    </p>
    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Institute Name:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${instituteName}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Contact Number:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${contact_number}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Address:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${address}</td>
      </tr>
    </table>
    <p style="font-size: 14px; color: #555; line-height: 1.6;">
      There are your keys for joining you students,teachers and parents to your platform
    </p>
    <table>
    <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Student Key:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${student_key}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Teacher Key:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${teacher_key}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Parent Key:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${parent_key}</td>
      </tr>
    </table>
    <p style="font-size: 16px; color: #555; line-height: 1.6; margin-top: 20px;">
      Please find the attached acknowledgment PDF for your payment. If you have any questions, feel free to contact us.
    </p>
    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      Thank you,<br />
      <b>The digisir Team</b>
    </p>
  </div>
    `;
