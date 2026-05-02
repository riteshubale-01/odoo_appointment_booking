import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  async onModuleInit() {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    this.logger.log(`Ethereal Email initialized: ${testAccount.user}`);
  }

  async sendOtpEmail(to: string, otp: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Appointment Booking" <noreply@booking.com>',
        to,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
        html: `<b>Your OTP code is ${otp}</b><br/>It expires in 10 minutes.`,
      });

      this.logger.log(`Message sent: ${info.messageId}`);
      this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      this.logger.error('Failed to send OTP email', error);
      throw new Error('Failed to send email');
    }
  }
}
