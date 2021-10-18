import { Inject, Injectable, Scope } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TelegramOptions } from './telegram-options.interface';
import { TELEGRAM_OPTIONS } from './telegram.constant';

@Injectable({ scope: Scope.DEFAULT })
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

  /**
   *
   * @param chain_id
   * @param message
   */
  sendMessage(chain_id: Number, message: string) {
    this.bot.sendMessage(chain_id, message);
  }
}
