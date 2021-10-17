import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import path from 'path';
import Piscina from 'piscina';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import fs from 'fs';
import os from 'os';
import { NotificationService } from '../modules/notification';

@Injectable()
class BalanceStrategy implements OnModuleInit {
  private readonly defaultRedisClient: Redis;
  private redisKey = 'tr:balance-top2:list';

  constructor(
    private readonly notificationService: NotificationService,
    private readonly redisService: RedisService,
  ) {
    this.defaultRedisClient = this.redisService.getClient();
  }
  onModuleInit() {
    this.handle();
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
         * category
         *    chain
         *      address
         *        token
         *            before
         *            newest
         *            ratio
         *
         */

        fs.appendFileSync(
          // path.join(__dirname, '../../../logs/notification.txt'),
          'logs/notification.txt',
          JSON.stringify(result) + os.EOL,
        );

        this.notificationService.create({ content: result });
      }
    }
  }
}

export { BalanceStrategy as Strategy };
