import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import path from 'path';
import Piscina from 'piscina';
import { BalanceService } from '../modules/balance';

@Injectable()
class BalanceStrategy {
  constructor(private readonly balanceService: BalanceService) {}
  @Cron('*/5 * * * * *')
  async handle() {
    const piscina = new Piscina({
      // The URL must be a file:// URL
      filename: path.resolve(__dirname, './work/balance.work.js'),
    });

    const result = await piscina.run({ a: 4, b: 6 });
    console.log(result); // Prints 10
  }
}

export { BalanceStrategy as Strategy };
