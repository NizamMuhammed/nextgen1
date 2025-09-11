# OTP (One-Time Password) Implementation

This document describes the complete OTP email verification system implemented for NextGen Electronics.

## Overview

The OTP system ensures that users verify their email addresses during registration by sending a 6-digit verification code to their registered email. This enhances security and ensures valid email addresses.

## Features

- ✅ 6-digit OTP generation
- ✅ Email delivery with beautiful HTML templates
- ✅ 10-minute OTP expiration
- ✅ Resend OTP functionality with countdown timer
- ✅ Email verification status tracking
- ✅ Welcome email after successful verification
- ✅ Responsive UI with loading states
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization

## Architecture

### Backend Components

1. **User Model** (`backend/models/User.js`)

   - Added `isEmailVerified`, `otp`, and `otpExpires` fields
   - Tracks verification status and OTP data

2. **Email Service** (`backend/services/emailService.js`)

   - Handles OTP and welcome email sending
   - Uses nodemailer with configurable email providers
   - Beautiful HTML email templates

3. **Auth Routes** (`backend/routes/auth.js`)
   - `/api/auth/signup` - Creates user and sends OTP
   - `/api/auth/verify-otp` - Verifies OTP and activates account
   - `/api/auth/resend-otp` - Resends OTP with new expiration

### Frontend Components

1. **SignupForm** (`frontend/src/SignupForm.jsx`)

   - Updated to show OTP verification step after registration
   - Handles transition between signup and verification

2. **OtpVerification** (`frontend/src/components/OtpVerification.jsx`)
   - Dedicated component for OTP input and verification
   - Includes resend functionality with countdown timer
   - Real-time validation and error handling

## User Flow

1. **Registration**

   - User fills out signup form
   - System creates account with `isEmailVerified: false`
   - OTP is generated and sent to user's email
   - User is redirected to OTP verification screen

2. **OTP Verification**

   - User enters 6-digit code from email
   - System validates OTP and expiration
   - On success: account is activated, welcome email sent
   - On failure: appropriate error message shown

3. **Resend OTP**
   - User can request new OTP if needed
   - 60-second countdown prevents spam
   - New OTP expires in 10 minutes

## API Endpoints

### POST `/api/auth/signup`

Creates a new user account and sends OTP email.

**Request Body:**

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Response:**

```json
{
  "message": "User registered successfully. Please check your email for verification code.",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "customer",
    "isEmailVerified": false
  }
}
```

### POST `/api/auth/verify-otp`

Verifies the OTP and activates the user account.

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "message": "Email verified successfully! Welcome to NextGen Electronics!",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "customer",
    "isEmailVerified": true
  }
}
```

### POST `/api/auth/resend-otp`

Resends OTP to the user's email address.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "message": "New OTP sent to your email address"
}
```

## Email Templates

### OTP Email

- Professional design with NextGen Electronics branding
- Clear 6-digit code display
- 10-minute expiration notice
- Responsive HTML layout

### Welcome Email

- Welcome message after successful verification
- List of available features
- Call-to-action button to start shopping
- Consistent branding

## Security Features

1. **OTP Expiration**: 10-minute time limit
2. **Rate Limiting**: 60-second cooldown for resend
3. **Input Validation**: Only numeric input for OTP
4. **Error Handling**: Comprehensive error messages
5. **Email Verification**: Required before account activation

## Configuration

### Environment Variables

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

### Email Service Setup

See `backend/EMAIL_CONFIGURATION.md` for detailed setup instructions.

## Testing

### Manual Testing

1. Register a new user
2. Check email for OTP
3. Enter OTP to verify
4. Test resend functionality
5. Test expired OTP handling

### Error Scenarios

- Invalid OTP
- Expired OTP
- Already verified email
- Non-existent user
- Network errors

## Future Enhancements

1. **SMS OTP**: Add SMS as alternative verification method
2. **Rate Limiting**: Implement server-side rate limiting
3. **Email Templates**: Add more email templates for different scenarios
4. **Analytics**: Track verification success rates
5. **Multi-language**: Support for multiple languages
6. **2FA**: Extend to two-factor authentication

## Troubleshooting

### Common Issues

1. **Emails not sending**: Check email configuration and credentials
2. **OTP not working**: Verify OTP hasn't expired
3. **UI not updating**: Check network requests in browser dev tools
4. **Database errors**: Ensure MongoDB connection is working

### Debug Mode

Enable detailed logging by setting `DEBUG_EMAIL=true` in environment variables.

## Dependencies

### Backend

- `nodemailer`: Email sending functionality
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token generation
- `mongoose`: MongoDB object modeling

### Frontend

- `react`: UI framework
- Custom UI components for consistent design

## Performance Considerations

- OTP generation is lightweight (Math.random())
- Email sending is asynchronous
- Database queries are optimized
- Frontend state management is efficient
- No unnecessary re-renders

This implementation provides a robust, secure, and user-friendly email verification system that enhances the overall security and user experience of NextGen Electronics.
