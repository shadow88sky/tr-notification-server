import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAddressPayload } from './address.payload';
import { AddressService } from './address.service';
import { SyncService } from '../sync';
import { MAX_SYNC_DAY } from '../../constants';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly syncService: SyncService,
  ) {}

  /**
   * paginate
   * @returns
   */
  @Get()
  async paginate() {
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
    this.syncService.handleAddressBalancesHistory(
      payload.address,
      payload.chain_id,
      MAX_SYNC_DAY,
    );

    return result;
  }
}
