import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const useGmail = process.env.EMAIL_USER && process.env.EMAIL_PASS;

  if (useGmail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: process.env.NODE_ENV === 'development',
    });

    try {
      await transporter.verify();
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
      console.log('Message sent via Gmail SMTP: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email via Gmail:', error);
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    console.log('EMAIL_USER and/or EMAIL_PASS not configured. Falling back to Ethereal SMTP.');
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: 'FC ESCUELA <no-reply@fcescuela.com>',
      to,
      subject,
      html,
    });

    console.log('Message sent via Ethereal: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;
  }
}