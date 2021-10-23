import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import PQueue from 'p-queue';
import { request, gql, GraphQLClient } from 'graphql-request';
import moment from 'moment';
import _ from 'lodash';
import { BalanceService } from '../../balance';
import { AddressService } from '../../address';
import { HistoryService } from '../../history';
import { ChainEnum, MAX_SYNC_DAY } from '../../../constants';
import { ConfigService } from '../../config';
import { LoggerService } from '../../common';

@Injectable()
export class BitQueryService implements OnModuleInit {
  private readonly queue: PQueue;
  constructor(
    private readonly balanceService: BalanceService,
    private readonly addressService: AddressService,
    private readonly historyService: HistoryService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.queue = new PQueue({ concurrency: 5 });
  }
  async onModuleInit() {
    // console.log('onModuleInit');
    // const result = await this.queryBalances({
    //   network: 'ethereum',
    //   address: ['0x4319e7a95fd3f0660d25bc6a4ecdc0f3cb4200c5'],
    // });
    // console.log('result', result);
  }

  /**
   * querySnapshotProposals
   * @param variables
   * @returns
   */
  async queryBalances(variables) {
    const graphQLClient = new GraphQLClient(
      this.configService.get('BITQUERY_URL'),
      {
        headers: {
          'X-API-KEY': this.configService.get('BITQUERY_API_KEY'),
        },
      },
    );
    const query = gql`
      query ($network: EthereumNetwork!, $address: [String!]) {
        ethereum(network: $network) {
          address(address: { in: $address }) {
            balances {
              currency {
                address
                symbol
                tokenType
              }
              value
            }
            address
          }
        }
      }
    `;
    return await graphQLClient.request(query, variables);
  }
}
