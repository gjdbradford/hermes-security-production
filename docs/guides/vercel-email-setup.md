# Vercel Email Service Setup Guide

This guide explains how to set up the email service to run on Vercel using serverless functions.

## Prerequisites

1. Vercel account
2. SMTP email service (Gmail, SendGrid, etc.)
3. Domain configured for email sending

## Step 1: Install Dependencies

The following dependencies have been added to `package.json`:

```bash
npm install nodemailer @types/nodemailer @vercel/node
```

## Step 2: Configure Environment Variables

In your Vercel dashboard, add the following environment variables:

### Required Variables:
- `SMTP_HOST` - Your SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT` - SMTP port (usually 587 for TLS, 465 for SSL)
- `SMTP_SECURE` - true for SSL (port 465), false for TLS (port 587)
- `SMTP_USER` - Your email username
- `SMTP_PASS` - Your email password or app password
- `EMAIL_FROM` - The from email address

### Example for Gmail:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@hermessecurity.io
```

## Step 3: Gmail App Password Setup

If using Gmail:

1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings > Security > App passwords
3. Generate an app password for "Mail"
4. Use this app password as `SMTP_PASS`

## Step 4: Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy the project

The API route will be available at: `https://your-domain.vercel.app/api/send-email`

## Step 5: Test the Email Service

1. Fill out the contact form on your website
2. Check the Vercel function logs for any errors
3. Verify emails are being received

## Troubleshooting

### Common Issues:

1. **Authentication Failed**: Check your SMTP credentials
2. **Connection Timeout**: Verify SMTP host and port
3. **Rate Limiting**: Implement rate limiting if needed
4. **Spam Filters**: Ensure proper email headers and content

### Logs:
Check Vercel function logs in the dashboard for detailed error messages.

## Security Considerations

1. Never commit SMTP credentials to version control
2. Use environment variables for all sensitive data
3. Implement rate limiting to prevent abuse
4. Validate all input data
5. Use HTTPS for all communications

## Alternative Email Services

You can also use:
- SendGrid
- Mailgun
- Amazon SES
- Resend

Simply update the SMTP configuration in the serverless function.
```
