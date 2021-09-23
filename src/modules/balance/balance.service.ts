import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { Balance } from './balance.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
  ) {}

  /**
   * create
   * @param payload
   * @returns
   */
  async create(payload: Balance) {
    return await this.balanceRepository.save(payload);
  }

  /**
   *
   * @param payload
   * @returns
   *
   * ignore duplicate key value violates unique constraint "address_contract_updated"
   */
  async handleMany(payload) {
    try {
      const arr = [];
      payload.items.forEach((item) => {
        console.log('item', item);
        let balance = new Balance();
        balance.address = payload.address;
        balance.balance = new Decimal(item.balance)
          .div(10 ** item.contract_decimals)
          .toString();
        balance.balanceExact = item.balance;
        balance.type = item.type;
        balance.quote_currency = payload.quote_currency;
        balance.chain_id = payload.chain_id;
        balance.contract_decimals = item.contract_decimals;
        balance.contract_ticker_symbol = item.contract_ticker_symbol;
        balance.contract_name = item.contract_name;
        balance.contract_address = item.contract_address;
        balance.quote_rate = item.quote_rate;
        balance.updated_at = payload.updated_at;
        balance.supports_erc = item.supports_erc;
        balance.nft_token_id = _.get(item, 'nft_data[0].token_id');
        arr.push(balance);
      });

      return await this.balanceRepository.save(arr);
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
    return await this.balanceRepository.findOne(options);
  }
}
