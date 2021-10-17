import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TreasuryService } from './treasury.service';
import { LoggerService } from '../common';
import { CreateTreasuryPayload } from './treasury.payload';

@Controller('treasury')
@ApiTags('Treasury')
export class TreasuryController {
  constructor(
    private readonly treasuryRepository: TreasuryService,
    private readonly loggerService: LoggerService,
  ) {}
  /**
   * create
   * @param payload
   * @returns
   */
  @Post()
  async create(@Body() payload: CreateTreasuryPayload) {
    this.loggerService.info(`create treasury:${payload}`);
    const result = await this.treasuryRepository.create(payload);

    /*
    await this.syncService.handleAddressBalancesHistory(
      payload.address,
      payload.chain_id,
      MAX_SYNC_DAY,
    );
    */

    return result;
  }

  /**
   * paginate
   * @returns
   */
  @Get()
  async paginate() {
    this.loggerService.info('paginate');
    return this.treasuryRepository.paginate({ page: 1, limit: 10 });
  }
}
