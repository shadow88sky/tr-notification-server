import { Controller, Delete, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BalanceService } from './balance.service';
import { LoggerService, QueryParams } from '../common/';

@Controller('balance')
@ApiTags('Balance')
export class BalanceController {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly loggerService: LoggerService,
  ) {}

  /**
   * DeleteBefore
   * @returns
   */
  @Delete('deleteBefore')
  async DeleteBefore() {
    const sql = `delete from balances where created_at<= current_date-'2 day'::interval`;
    return this.balanceService.query(sql);
  }

  /**
   * paginate
   * @returns
   */
  @Get()
  async paginate(@QueryParams(['address']) { options, querys }) {
    this.loggerService.info('paginate:querys:%O', querys);
    return this.balanceService.paginate(options, querys);
  }
}
