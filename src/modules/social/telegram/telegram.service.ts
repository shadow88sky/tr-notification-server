import { Inject, Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TelegramOptions } from './telegram-options.interface';
import { TELEGRAM_OPTIONS } from './telegram.constant';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  constructor(
    @Inject(TELEGRAM_OPTIONS) private readonly telegramOptions: TelegramOptions,
  ) {
    this.bot = new TelegramBot(
      this.telegramOptions.token,
      this.telegramOptions.options,
    );
  }
  sendMessage() {
    this.bot.sendMessage(-662695190, 'hello');
  }
}
