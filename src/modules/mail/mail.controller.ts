import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from '.';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * sendMailMessage
   * 
   * @returns
   */
  @Post()
  async sendMailMessage() {
    return await this.mailService.sendMessage();
  }
}
