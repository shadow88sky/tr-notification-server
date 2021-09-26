import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAddressPayload } from './address.payload';
import { AddressService } from './address.service';
import { LoggerService } from '../common/';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly loggerService: LoggerService,
  ) {}

  /**
   * paginate
   * @returns
   */
  @Get()
  async paginate() {
    this.loggerService.info('paginate');
    return this.addressService.paginate({ page: 1, limit: 10 });
  }

  /**
   * create
   * @param payload
   * @returns
   */
  @Post()
  async create(@Body() payload: CreateAddressPayload) {
    const result = await this.addressService.create(payload);

    /*
    await this.syncService.handleAddressBalancesHistory(
      payload.address,
      payload.chain_id,
      MAX_SYNC_DAY,
    );
    */

    return result;
  }
}
