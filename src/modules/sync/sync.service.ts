import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BalanceService } from 'modules/balance';
import request from 'request-promise';
import PQueue from 'p-queue';
import moment from 'moment';
import { AddressService } from 'modules/address';
import { HistoryService } from 'modules/history';
import { MAX_SYNC_DAY } from '../../constants';
import { ConfigService } from 'modules/config';

const queue = new PQueue({ concurrency: 5 });
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
  constructor(
    private readonly balanceService: BalanceService,
    private readonly addressService: AddressService,
    private readonly historyService: HistoryService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // await this.asynBeforeAddressBalancesHistory();
  }

  /**
   * asynAddressBalances
   * 每隔10分钟执行一次
   */
  @Cron('0 */10 * * * *')
  async asynAddressBalances() {
    //
    const addressList = await this.addressService.find({});

    addressList.forEach((item) => {
      queue.add(() => {
        this.handleAddressBalances(item.address, item.chain_id);
      });
    });

    //
  }

  /**
   * asynAddressBalancesHistory
   * @returns
   * 每天2点执行一次
   */
  @Cron('0 0 2 * * *')
  async asynAddressBalancesHistory() {
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

      queue.add(() => {
        this.handleAddressBalancesHistory(item.address, item.chain_id, days);
      });
    }
    //
  }

  /**
   * asynBeforeAddressBalancesHistory
   * 每天0点执行一次
   */
  @Cron('0 0 0 * * *')
  async asynBeforeAddressBalancesHistory() {
    //
    const addressList = await this.addressService.find({
      where: {
        is_sync_before: false,
      },
    });

    for (let index = 0; index < addressList.length; index++) {
      const item = addressList[index];
      const days = MAX_SYNC_DAY;

      queue.add(() => {
        this.handleAddressBalancesHistory(item.address, item.chain_id, days);
      });
    }
    //
  }

  async handleAddressBalances(address: string, chain_id: number) {
    const options = {
      method: 'GET',
      url: `https://api.covalenthq.com/v1/${chain_id}/address/${address}/balances_v2/?&nft=true&key=${this.configService.get(
        'COVALENTHQ_KEY',
      )}"`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await request(options);

    await this.balanceService.handleMany(response.data);
  }

  /**
   *
   * @param address
   * @param chain_id
   * @param days
   */
  async handleAddressBalancesHistory(
    address: string,
    chain_id: number,
    days: number,
  ) {
    const options = {
      method: 'GET',
      url: `https://api.covalenthq.com/v1/${chain_id}/address/${address}/portfolio_v2/?&days=${days}&key=${this.configService.get(
        'COVALENTHQ_KEY',
      )}"`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await request(options);

    await this.historyService.handleMany(response, days);
  }
}
