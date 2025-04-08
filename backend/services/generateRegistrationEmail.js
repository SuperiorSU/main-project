import dotenv from 'dotenv';
dotenv.config();

/**
 * Generate registration success email with verification link
 * @param {string} name - Member's name
 * @param {string} verificationToken - Token for email verification
 * @returns {Object} - Email subject and HTML/text content
 */
export const generateRegistrationEmail = (name, verificationToken) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationLink = `${baseUrl}/verify-email/${verificationToken}`;
  
  return {
    subject: 'Welcome to Super60 - Please Verify Your Email',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Super60!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 5px;
        }
        .header {
          background-color: #4a90e2;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #4a90e2;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          margin: 20px 0;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Super60!</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for registering with Super60! We're excited to have you join our community.</p>
          <p>Your registration was successful, but before you can log in, we need to verify your email address.</p>
          
          <p style="text-align: center;">
            <a href="${verificationLink}" class="button">Verify Your Email</a>
          </p>
          
          <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
          <p style="word-break: break-all;">${verificationLink}</p>
          
          <p>This verification link will expire in 24 hours.</p>
          
          <p>If you did not create this account, please ignore this email.</p>
          
          <p>Best regards,<br>The Super60 Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Super60. All rights reserved.</p>
          <p>This email was sent to you because you registered for a Super60 account.</p>
        </div>
      </div>
    </body>
    </html>
    `,
    text: `
    Welcome to Super60!
    
    Hello ${name},
    
    Thank you for registering with Super60! We're excited to have you join our community.
    
    Your registration was successful, but before you can log in, we need to verify your email address.
    
    Please verify your email by visiting:
    ${verificationLink}
    
    This verification link will expire in 24 hours.
    
    If you did not create this account, please ignore this email.
    
    Best regards,
    The Super60 Team
    
    © ${new Date().getFullYear()} Super60. All rights reserved.
    This email was sent to you because you registered for a Super60 account.
    `
  };
};