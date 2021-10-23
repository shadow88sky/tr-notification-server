import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import request from 'request-promise';
import PQueue from 'p-queue';
import moment from 'moment';
import _ from 'lodash';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { BalanceService } from '../balance';
import { AddressService } from '../address';
import { HistoryService } from '../history';
import { ChainEnum, MAX_SYNC_DAY } from '../../constants';
import { ConfigService } from '../config';
import { LoggerService } from '../common/';

// const queue = new PQueue({ concurrency: 5 });
/*

* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second (optional)

*/
@Injectable()
export class SyncService implements OnModuleInit {
  private readonly defaultRedisClient: Redis;
  private redisKey = 'tr:balance-top2:list';

  private readonly queue: PQueue;
  constructor(
    private readonly balanceService: BalanceService,
    private readonly addressService: AddressService,
    private readonly historyService: HistoryService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly loggerService: LoggerService,
  ) {
    this.defaultRedisClient = this.redisService.getClient();
    this.queue = new PQueue({ concurrency: 5 });
  }

  async onModuleInit() {
    this.syncAddressBalancesFromDebank();
    this.syncBalanceToRedis();
  }

  /**
   * asynAddressBalances
   * 每隔10分钟执行一次
   */
  // @Cron('0 */10 * * * *')
  async syncAddressBalances() {
    //
    const addressList = await this.addressService.find({
      relations: ['treasury'],
    });

    for (let index = 0; index < addressList.length; index++) {
      const item = addressList[index];
      await this.queue.add(async () => {
        await this.handleAddressBalances(item);
      });
    }
    // addressList.forEach((item) => {
    //  await queue.add(() => {
    //     this.handleAddressBalances(item);
    //   });
    // });

    //
  }

  /**
   * asynAddressBalances
   * 每隔10分钟执行一次
   */
  @Cron('0 */10 * * * *')
  async syncAddressBalancesFromDebank() {
    //
    const addressList = await this.addressService.find({
      relations: ['treasury'],
    });

    for (let index = 0; index < addressList.length; index++) {
      const item = addressList[index];
      await this.queue.add(async () => {
        await this.handleAddressBalancesFromDebank(item);
      });
    }
  }

  /**
   * asynAddressBalancesHistory
   * @returns
   * 每天2点执行一次
   */
  // @Cron('0 0 2 * * *')
  async syncAddressBalancesHistory() {
    //

    /* test 
    queue.add(() => {
      this.handleAddressBalancesHistory(
        '0xa7324Ea37c1e954513ce826D147A3b6dA4bB9cB3',
        1,
      );
    });
    */

    const addressList = await this.addressService.find({});

    for (let index = 0; index < addressList.length; index++) {
      const item = addressList[index];
      const recentHistory = await this.historyService.findOne({
        where: {
          address: item.address,
        },
        order: {
          timestamp: 'DESC',
        },
      });

      let days = MAX_SYNC_DAY;
      if (recentHistory) {
        const diffDays = moment(new Date()).diff(
          moment(recentHistory.timestamp),
          'days',
        );
        days = diffDays - 1;
      }
      if (days < 0) {
        return;
      }

      this.queue.add(() => {
        this.handleAddressBalancesHistory(item.address, item.chain_id, days);
      });
    }
    //
  }

  /**
   * asynBeforeAddressBalancesHistory
   * 每天0点执行一次
   */
  // @Cron('0 0 0 * * *')
  async syncBeforeAddressBalancesHistory() {
    //
    const addressList = await this.addressService.find({
      where: {
        is_sync_before: false,
      },
    });

    for (let index = 0; index < addressList.length; index++) {
      const item = addressList[index];
      const days = MAX_SYNC_DAY;

      this.queue.add(() => {
        this.handleAddressBalancesHistory(item.address, item.chain_id, days);
      });
    }
    //
  }

  /**
   * syncBalanceToRedis
   *
   * @description sync latest balance  to redis
   *
   *  每隔6分钟执行一次
   */
  @Cron('0 */6 * * * *')
  async syncBalanceToRedis() {
    const addressList = await this.addressService.find({
      select: ['address'],
    });

    if (!addressList.length) {
      return;
    }

    let addressArr = [];
    _.forEach(addressList, (item) => {
      addressArr.push(`'${item.address}'`);
    });
    //

    const sql = `
      SELECT balances.treasury_id,contract_address,balances.chain_id,address,
      (array_agg(balances.id ORDER BY balances.updated_at DESC))[1] as id ,treasuries."name",
      (array_agg(balances.balance ORDER BY balances.updated_at DESC))[1] as balance ,
      (array_agg(balances.contract_ticker_symbol ORDER BY balances.updated_at DESC))[1] as contract_ticker_symbol 
      from balances
	    INNER JOIN treasuries on treasuries."id" = balances.treasury_id 
      WHERE balances.address IN (${addressArr.join(',')})
      GROUP BY balances.treasury_id,contract_address,chain_id,address,treasuries."name"
   `;

    //

    const result = await this.balanceService.query(sql);
    //

    //   "8961f5f7-c0e7-4ac7-a072-e48ba03f354e":[
    //     {
    //         "1":[{
    //             "0x4750c43867ef5f89869132eccf19b9b6c4286e1a":[{
    //                 "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee":"0"
    //             }]
    //         }]
    //     }
    // ]
    // {
    //   treasury_id: '8961f5f7-c0e7-4ac7-a072-e48ba03f354e',
    //   contract_address: '0x2b4742593da55d694cf563563ef161c62bdc1d09',
    //   chain_id: 1,
    //   address: '0x4750c43867ef5f89869132eccf19b9b6c4286e1a',
    //   id: '4c2ae4b2-41f9-41b0-ae2c-f9f780c8a810',
    //   balance: '83262.65432',
    //   updated_at: 2021-09-27T03:30:04.331Z
    // },
    // let balanceObj: Record<string, string>;
    let balanceObj: Record<string, Object> = {};
    if (result.length) {
      _.forEach(
        result,
        ({
          treasury_id,
          chain_id,
          address,
          contract_address,
          balance,
          contract_ticker_symbol,
          name,
        }) => {
          //
          balanceObj[
            `${treasury_id}:${ChainEnum[chain_id]}:${address}:${contract_address}`
          ] = {
            balance,
            chain_id,
            address,
            treasury_id,
            name,
            contract_ticker_symbol,
          };
        },
      );
    }

    await this.defaultRedisClient.lpush(
      this.redisKey,
      JSON.stringify(balanceObj),
    );
    await this.defaultRedisClient.ltrim(this.redisKey, 0, 1);
    await this.defaultRedisClient.expire(this.redisKey, 60 * 20); // 20 minutes
  }

  /**
   * covalenthq api
   * @param address
   */
  async handleAddressBalances(address) {
    try {
      const options = {
        method: 'GET',
        url: `https://api.covalenthq.com/v1/${address.chain_id}/address/${
          address.address
        }/balances_v2/?&nft=true&key=${this.configService.get(
          'COVALENTHQ_KEY',
        )}`,
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      };
      const response = await request(options);

      if (response.data) {
        await this.balanceService.handleMany(response.data, address);
      }
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  /**
   * debank api
   * @param address
   */
  async handleAddressBalancesFromDebank(address) {
    try {
      const options = {
        method: 'GET',
        url: `https://openapi.debank.com/v1/user/token_list?id=${address.address}&chain_id=${address.chain_id}&is_all=true&has_balance=true`,
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      };
      const response = await request(options);
      //
      if (response) {
        await this.balanceService.handleManyFromDebank(response, address);
      }
    } catch (error) {
      this.loggerService.error(error);
    }
  }

  /**
   *
   * @param address
   * @param chain_id
   * @param days
   */
  async handleAddressBalancesHistory(
    address: string,
    chain_id: string,
    days: number,
  ) {
    console.log(
      'handleAddressBalancesHistory',
      `https://api.covalenthq.com/v1/${chain_id}/address/${address}/portfolio_v2/?&days=${days}&key=${this.configService.get(
        'COVALENTHQ_KEY',
      )}`,
    );
    const options = {
      method: 'GET',
      url: `https://api.covalenthq.com/v1/${chain_id}/address/${address}/portfolio_v2/?&days=${days}&key=${this.configService.get(
        'COVALENTHQ_KEY',
      )}`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await request(options);

    if (response.address) {
      await this.historyService.handleMany(response, days);
    }
  }
}
