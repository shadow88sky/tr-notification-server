import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import _ from 'lodash';
import Decimal from 'decimal.js';

import { History } from './history.entity';
import { AddressService } from '../address';
import { MAX_SYNC_DAY } from '../../constants';

@Injectable()
export class HistoryService implements OnModuleInit {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly addressService: AddressService,
  ) {}

  onModuleInit() {}

  /**
   *
   * @param payload
   * @returns
   *
   * ignore duplicate key value violates unique constraint "address_contract_updated"
   */
  async handleMany(payload, days: number) {
    try {
      const arr = [];
      payload.items.forEach((item) => {
        const holdings = _.get(item, 'holdings');
        holdings.forEach((holding) => {
          let history = new History();
          history.address = payload.address;
          history.balance = new Decimal(_.get(holding, 'close.balance'))
            .div(10 ** item.contract_decimals)
            .toString();
          history.balanceExact = _.get(holding, 'close.balance');
          history.quote_currency = payload.quote_currency;
          history.chain_id = payload.chain_id;
          history.contract_decimals = item.contract_decimals;
          history.contract_ticker_symbol = item.contract_ticker_symbol;
          history.contract_name = item.contract_name;
          history.contract_address = item.contract_address;
          history.quote_rate = holding.quote_rate;
          history.updated_at = payload.updated_at;
          history.timestamp = holding.timestamp;
          arr.push(history);
        });
      });

      if (days === MAX_SYNC_DAY) {
        await this.addressService.update(
          { address: payload.address },
          {
            is_sync_before: true,
          },
        );
      }

      return await this.historyRepository.save(arr);
    } catch (error) {
      if (error.code === '23505') {
        return;
        // ignore duplicate key value violates unique constraint "address_contract_updated"
      }

      throw error;
      // console.log('error', error);
    }
  }

  /**
   * findOne
   * @param options
   * @returns
   */
  async findOne(options) {
    return await this.historyRepository.findOne(options);
  }
}
