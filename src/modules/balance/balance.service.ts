import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Decimal from 'decimal.js';
import _ from 'lodash';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Balance } from './balance.entity';
import {
  BalanceFromType,
  EthereumContractAddress,
} from '../../constants/chain.constant';

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
  async handleMany(payload, address) {
    try {
      const arr = [];
      payload.items.forEach((item) => {
        let balance = new Balance();
        balance.address = payload.address;
        balance.balance = new Decimal(item.balance)
          .div(10 ** item.contract_decimals)
          .toString();
        balance.balanceExact = item.balance;
        balance.balance_usd = new Decimal(item.balance)
          .mul(item.quote_rate || 0)
          .toString();
        balance.type = item.type;
        balance.treasury = _.get(address, 'treasury');
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
      //
    }
  }

  /**
   *
   * @param payload
   * @param address
   * @returns
   */
  async handleManyFromDebank(payload, address) {
    try {
      const arr = [];
      payload.forEach((item) => {
        let balance = new Balance();
        balance.address = address.address;
        balance.balance = item.amount;
        balance.balanceExact = new Decimal(item.amount)
          .mul(10 ** item.decimals)
          .toString();
        balance.balance_usd = new Decimal(item.amount)
          .mul(item.price || 0)
          .toString();
        balance.type = '';
        balance.treasury = _.get(address, 'treasury');
        balance.quote_currency = 'usd';
        balance.chain_id = item.chain;
        balance.contract_decimals = item.decimals;
        balance.contract_ticker_symbol = item.symbol;
        balance.contract_name = item.name;
        balance.contract_address =
          item.id === 'eth' ? EthereumContractAddress : item.id;
        balance.quote_rate = item.price || '0';
        balance.updated_at = payload.updated_at;
        balance.supports_erc = [];
        balance.balance_from = BalanceFromType.debank;
        balance.nft_token_id = '';
        arr.push(balance);
      });

      return await this.balanceRepository.save(arr);
    } catch (error) {
      if (error.code === '23505') {
        return;
        // ignore duplicate key value violates unique constraint "address_contract_updated"
      }

      throw error;
      //
    }
  }

  async handleManyFromBitQuery(payload, { chain_id, treasury_id_map }) {
    try {
      const arr = [];
      payload.ethereum.address.forEach((address) => {
        address.balances.forEach((item) => {
          let balance = new Balance();
          balance.address = address.address;
          balance.balance = item.value;
          balance.balanceExact = new Decimal(item.value)
            .mul(10 ** item.currency.decimals)
            .toString();
          balance.balance_usd = '0';
          balance.type = '';

          console.log(
            '_.get(treasury_id_map, address.address.toLowerCase())',
            _.get(treasury_id_map, address.address.toLowerCase()),
          );
          balance.treasury = _.get(
            treasury_id_map,
            address.address.toLowerCase(),
          );
          balance.quote_currency = '';
          balance.chain_id = chain_id;
          balance.contract_decimals = item.currency.decimals;
          balance.contract_ticker_symbol = item.currency.symbol;
          balance.contract_name = item.currency.name;
          balance.contract_address =
            item.currency.address === '-'
              ? EthereumContractAddress
              : item.currency.address;

          balance.quote_rate = 0;
          balance.supports_erc = [];
          balance.nft_token_id = '';
          balance.balance_from = BalanceFromType.bitquery;
          arr.push(balance);
        });
      });

      return await this.balanceRepository.save(arr);
    } catch (error) {
      if (error.code === '23505') {
        return;
        // ignore duplicate key value violates unique constraint "address_contract_updated"
      }

      throw error;
      //
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

  /**
   *
   * @returns
   */
  query(sql) {
    return this.balanceRepository.query(sql);
  }

  /**
   * delete
   * @param payload
   * @returns
   */
  async delete(payload) {
    return await this.balanceRepository.delete(payload);
  }

  /**
   * paginate
   * @param options
   * @returns
   */
  async paginate(
    pagination: IPaginationOptions,
    querys,
  ): Promise<Pagination<Balance>> {
    return paginate<Balance>(this.balanceRepository, pagination, {
      order: {
        created_at: 'DESC',
      },
      where: querys,
    });
  }
}
