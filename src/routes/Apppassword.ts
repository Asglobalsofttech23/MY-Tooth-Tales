import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
// Create the Gmail transporter with App Password (not your main password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for user
    pass: process.env.EMAIL_PASS, // Use environment variable for password
  },
});

// Define the POST route to handle contact form submission
router.post('/send-email', (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  // Define the email options
  const mailOptions = {
    from: email, // Sender's email address (from the form)
    to: process.env.EMAIL_USER, // Recipient's email address (use environment variable for recipient)
    subject: 'Contact Us Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`, // Email content
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email', error: error.message });
    } else {
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'Message sent successfully!' });
    }
  });
});
export default router;