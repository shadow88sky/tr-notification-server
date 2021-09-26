import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '../config';
import { LoggerService } from '../common/';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  /**
   * sendMessage
   *
   */
  async sendMessage() {
    if (this.configService.get('EMAIL_SEND') !== 'true') {
      this.loggerService.info('mock sendMessage success');
      return;
    }
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
