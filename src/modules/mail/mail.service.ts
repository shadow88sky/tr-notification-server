import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * sendMessage
   * 
   */
  async sendMessage() {
    await this.mailerService.sendMail({
      to: '',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        name: 'test',
        url: 'tet',
      },
    });
  }
}
