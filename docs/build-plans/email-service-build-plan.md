# Email Service Build Plan

## Overview
This document outlines the build plan for the Hermes Security email service integration with Vercel serverless functions.

## Architecture

### Frontend (Client-side)
- **Location**: `src/services/`
- **Files**: 
  - `contactApi.ts` - Main contact form submission handler
  - `emailService.ts` - Email formatting and client-side logic
- **Purpose**: Handle form submission, format data, and communicate with backend

### Backend (Serverless Functions)
- **Location**: `api/`
- **Files**:
  - `send-email.ts` - Vercel serverless function for email sending
- **Purpose**: Secure email sending with SMTP credentials

### Configuration
- **Location**: Root directory
- **Files**:
  - `vercel.json` - Vercel deployment configuration
  - `package.json` - Dependencies and scripts
- **Purpose**: Environment setup and deployment configuration

## Dependencies

### Production Dependencies
```json
{
  "nodemailer": "^6.9.8"
}
```

### Development Dependencies
```json
{
  "@types/nodemailer": "^6.4.14",
  "@vercel/node": "^3.0.21"
}
```

## Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build:production
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

## Environment Variables Required

### Vercel Environment Variables
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_SECURE` - SSL/TLS configuration
- `SMTP_USER` - Email username
- `SMTP_PASS` - Email password/app password
- `EMAIL_FROM` - From email address

### Client Environment Variables (Optional)
- `VITE_EMAILJS_SERVICE_ID` - EmailJS fallback service
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS template
- `VITE_EMAILJS_USER_ID` - EmailJS user ID

## File Structure
