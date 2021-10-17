import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MoreThan } from 'typeorm';
import { BalanceService } from '../modules/balance';

@Injectable()
class BalanceDayStrategy {
  constructor(private readonly balanceService: BalanceService) {}


  // SELECT * FROM (SELECT * ,  "dense_rank"() OVER (PARTITION BY address ORDER BY "updated_at" DESC) as rank_row FROM balances) AS sb 

  // @Cron('*/5 * * * * *')
  // async handle() {
  //   const balanceDay = await this.balanceService.findOne({
  //     where: {
  //       address: '0xc7903c44d1e73aed63942b9b107b35b9aadbcf1e',
  //       updated_at: MoreThan('2021-09-25'),
  //     },
  //     order: {
  //       updated_at: 'ASC',
  //     },
  //   });

  //   console.log('balanceDay', balanceDay);
  // }
}

export { BalanceDayStrategy as Strategy };
