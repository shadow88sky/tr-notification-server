import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TreasuryService } from './treasury.service';
import { LoggerService, QueryParams } from '../common';
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
  async paginate(@QueryParams(["name"]) { options, querys }) {
    this.loggerService.info('paginate:querys:%O', querys);
    return this.treasuryRepository.paginate(options,querys);
  }
}
