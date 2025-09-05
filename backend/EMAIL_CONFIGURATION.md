# Email Configuration for OTP Functionality

This document explains how to configure email settings for the OTP (One-Time Password) functionality in NextGen Electronics.

## Required Environment Variables

Add the following environment variables to your `.env` file in the backend directory:

```env
# Email Configuration (for OTP functionality)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

## Gmail Configuration

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password

1. In Google Account settings, go to Security
2. Under "2-Step Verification", click on "App passwords"
3. Select "Mail" as the app
4. Select "Other" as the device and enter "NextGen Electronics"
5. Copy the generated 16-character password
6. Use this password as `EMAIL_PASS` in your `.env` file

### Step 3: Update Environment Variables

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

## Other Email Services

### Outlook/Hotmail

```env
EMAIL_SERVICE=hotmail
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

### Yahoo

```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your_email@yahoo.com
EMAIL_PASS=your_app_password
```

### Custom SMTP

```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your_email@yourdomain.com
EMAIL_PASS=your_password
```

## Testing Email Configuration

1. Start the backend server: `npm run dev`
2. Try registering a new user
3. Check your email for the OTP code
4. If emails are not being sent, check the console logs for error messages

## Troubleshooting

### Common Issues

1. **"Invalid login" error**: Make sure you're using an App Password, not your regular Gmail password
2. **"Less secure app access" error**: Enable 2-Factor Authentication and use App Passwords
3. **Emails going to spam**: Check your spam folder and mark emails as "Not Spam"
4. **Connection timeout**: Check your internet connection and firewall settings

### Debug Mode

To enable detailed email logging, add this to your `.env` file:

```env
DEBUG_EMAIL=true
```

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of your main account password
- Regularly rotate your App Passwords
- Consider using a dedicated email account for your application

## Production Considerations

For production deployment:

- Use a dedicated email service like SendGrid, Mailgun, or AWS SES
- Implement rate limiting for OTP requests
- Add email templates for different languages
- Set up proper error handling and monitoring
