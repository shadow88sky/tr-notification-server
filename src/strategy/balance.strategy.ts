import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import path from 'path';
import Piscina from 'piscina';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import moment from 'moment';
import handlebars from 'handlebars';
import { NotificationService } from '../modules/notification';
import { TelegramService } from '../modules/social';
import { ConfigService } from '../modules/config';
import { tpl } from '../template/notification.tpl';

@Injectable()
class BalanceStrategy implements OnModuleInit {
  private readonly defaultRedisClient: Redis;
  private redisKey = 'tr:balance-top2:list';
  private template;
  constructor(
    private readonly notificationService: NotificationService,
    private readonly redisService: RedisService,
    private readonly telegramService: TelegramService,
    private readonly configService: ConfigService,
  ) {
    this.defaultRedisClient = this.redisService.getClient();

    this.template = handlebars.compile(tpl);
  }
  onModuleInit() {
    this.handle();
    // this.telegramService.sendMessage(
    //   Number(this.configService.get('TELEGRAM_CHAT_ID')),
    // this.template({
    //   content: [
    //     {
    //       treasury_id: 'c123676f-8675-437f-b8de-af220cb723a1',
    //       address: '0xdae36002431aa9394be363d3d43fbdb6de6af7cc',
    //       chain_id: 'matic',
    //       contract_ticker_symbol: 'LitCoin',
    //       newest: '10000',
    //       before: '100000',
    //       treasury: 'YGG',
    //       ratio: '-90%',
    //     },
    //     {
    //       treasury_id: 'c123676f-8675-437f-b8de-af220cb723a1',
    //       address: '0xdae36002431aa9394be363d3d43fbdb6de6af7cc',
    //       chain_id: 'matic',
    //       contract_ticker_symbol: 'LitCoin',
    //       newest: '10000',
    //       before: '100000',
    //       treasury: 'YGG',
    //       ratio: '-90%',
    //     },
    //   ],
    //   id: 'c8e3449d-bb25-4a2b-a974-38fc2791c0fa',
    //   created_at: '2021-10-17T19:23:32.372Z',
    //   updated_at: '2021-10-17T19:23:32.372Z',
    // }),
    // );
  }

  /**
   *
   */
  @Cron('0 */8 * * * *')
  async handle() {
    const ratioLimit = 0.02;
    const newest = await this.defaultRedisClient.lindex(this.redisKey, 0);

    const before = await this.defaultRedisClient.lindex(this.redisKey, 1);

    const piscina = new Piscina({
      // The URL must be a file:// URL
      filename: path.resolve(__dirname, './work/balance.work.js'),
    });

    if (newest && before) {
      const result = await piscina.run({
        newest: JSON.parse(newest),
        before: JSON.parse(before),
        ratioLimit,
      });

      if (result.length) {
        // send msg
        /**
         *
         */
        // fs.appendFileSync(
        //   // path.join(__dirname, '../../../logs/notification.txt'),
        //   'logs/notification.txt',
        //   JSON.stringify(result) + os.EOL,
        // );

        const notification = await this.notificationService.create({
          content: result,
        });

        if (notification) {
          notification.created_at = moment(notification.created_at)
            .add(8, 'hours')
            .format('YYYY-MM-DD HH:mm:ss');
          this.telegramService.sendMessage(
            Number(this.configService.get('TELEGRAM_CHAT_ID')),
            this.template(notification),
          );
        }
      }
    }
  }
}

export { BalanceStrategy as Strategy };
