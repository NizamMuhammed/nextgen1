const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOTPEmail(email, otp, userName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "NextGen Electronics - Email Verification OTP",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">NextGen Electronics</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${userName}!</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for registering with NextGen Electronics. To complete your account setup, 
                please verify your email address using the OTP below:
              </p>
              
              <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <h3 style="color: #333; margin: 0 0 10px 0; font-size: 18px;">Your Verification Code</h3>
                <div style="background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 5px; letter-spacing: 5px; margin: 10px 0;">
                  ${otp}
                </div>
                <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
                  This code will expire in 10 minutes
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If you didn't create an account with NextGen Electronics, please ignore this email.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                © 2024 NextGen Electronics. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("OTP email sent successfully:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Error sending OTP email:", error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, userName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to NextGen Electronics!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to NextGen Electronics!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${userName}!</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Congratulations! Your email has been successfully verified and your account is now active.
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                You can now enjoy all the features of NextGen Electronics:
              </p>
              
              <ul style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; padding-left: 20px;">
                <li>Browse our latest electronics collection</li>
                <li>Add items to your wishlist</li>
                <li>Track your orders in real-time</li>
                <li>Manage your shipping addresses</li>
                <li>Get exclusive deals and offers</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" 
                   style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Start Shopping Now
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                © 2024 NextGen Electronics. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("Welcome email sent successfully:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
