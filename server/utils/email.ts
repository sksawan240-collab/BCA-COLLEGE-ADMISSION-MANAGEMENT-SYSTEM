import nodemailer from 'nodemailer';

export const sendEmail = async (options: { to: string, subject: string, text?: string, html?: string }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // We check if SMTP user is set, else we just log the email contents (useful in dev without creds)
    if (!process.env.SMTP_USER) {
      console.log('======= DEV EMAIL (Content not shown) =======');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log('=========================');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'admissions@sharnbasva.edu.in',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email could not be sent:', error);
  }
};