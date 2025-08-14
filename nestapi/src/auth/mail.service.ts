import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // SMTP設定に置き換え
      port: 587,
      secure: false,
      auth: {
        user: 'user@example.com',
        pass: 'password',
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const url = `https://yourdomain.com/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: '"YourApp" <no-reply@yourdomain.com>',
      to,
      subject: 'メールアドレス認証',
      html: `<p>以下のリンクをクリックしてメール認証を完了してください</p><a href="${url}">${url}</a>`,
    });
  }
}
