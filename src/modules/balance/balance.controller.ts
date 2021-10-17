import { Controller, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import moment from 'moment';
import { BalanceService } from './balance.service';

@Controller('balance')
@ApiTags('Balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  /**
   * DeleteBefore
   * @returns
   */
  @Delete('deleteBefore')
  async DeleteBefore() {
    const sql = `delete from balances where created_at<= current_date-'2 day'::interval`;
    return this.balanceService.query(sql);
  }
}
