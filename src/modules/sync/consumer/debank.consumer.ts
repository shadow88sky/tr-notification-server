import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import request from 'request-promise';
import _ from 'lodash';
import { BalanceService } from '../../balance';
import { LoggerService } from '../../common';

@Processor('sync')
export class DebankConsumer {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly loggerService: LoggerService,
  ) {}
  @Process('debank')
  async transcode(job: Job<unknown>) {
    if (job.data) {
      await this.handleAddressBalancesFromDebank(job.data);
    }

    return;
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
}
