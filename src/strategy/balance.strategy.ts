import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import path from 'path';
import Piscina from 'piscina';
import { BalanceService } from '../modules/balance';
import { MAX_SYNC_DAY } from '../constants';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
class BalanceStrategy {
  private readonly defaultRedisClient: Redis;
  private redisKey = 'tr:balance-top2:list';

  constructor(
    private readonly balanceService: BalanceService,
    private readonly redisService: RedisService,
  ) {
    this.defaultRedisClient = this.redisService.getClient();
  }
  @Cron('*/5 * * * * *')
  async handle() {
    const newest = await this.defaultRedisClient.lindex(this.redisKey, 0);

    // console.log('newest', newest);
    const before = await this.defaultRedisClient.lindex(this.redisKey, 1);

    // console.log('before', before);
    const piscina = new Piscina({
      // The URL must be a file:// URL
      filename: path.resolve(__dirname, './work/balance.work.js'),
    });

    const result = await piscina.run({
      newest: JSON.parse(newest),
      before: JSON.parse(before),
    });
    console.log(result);
  }
}

export { BalanceStrategy as Strategy };
