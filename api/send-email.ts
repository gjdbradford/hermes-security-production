import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

interface EmailRequest {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  headers: Record<string, string>;
  headersArray?: Array<{ key: string; value: string }>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const emailData: EmailRequest = req.body;

    // Validate required fields
    if (!emailData.to || !emailData.subject || !emailData.htmlBody) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, htmlBody'
      });
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    });

    // Prepare email options
    const mailOptions = {
      from: emailData.from || process.env.EMAIL_FROM || 'noreply@hermessecurity.io',
      to: emailData.to,
      replyTo: emailData.replyTo,
      subject: emailData.subject,
      html: emailData.htmlBody,
      text: emailData.textBody,
      headers: emailData.headers || {}
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('📧 Email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('❌ Email sending failed:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
