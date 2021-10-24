import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { gql, GraphQLClient } from 'graphql-request';
import _ from 'lodash';
import { BalanceService } from '../../balance';
import { ConfigService } from '../../config';
import { LoggerService } from '../../common';

@Processor('sync')
export class BitQueryConsumer {
  constructor(
    private readonly configService: ConfigService,
    private readonly balanceService: BalanceService,
    private readonly loggerService: LoggerService,
  ) {}
  @Process('bitquery')
  async transcode(job: Job<unknown>) {
    if (job.data) {
      // 
      await this.queryBalances(job.data);
    }

    return;
  }

  /**
   * querySnapshotProposals
   * @param variables
   * @returns
   */
  async queryBalances(variables) {
    try {
      
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
                  decimals
                  name
                }
                value
              }
              address
            }
          }
        }
      `;
      const response = await graphQLClient.request(query, variables);
      
      if (response) {
        await this.balanceService.handleManyFromBitQuery(response, variables);
      }
    } catch (error) {
      this.loggerService.error(error);
    }
  }
}
