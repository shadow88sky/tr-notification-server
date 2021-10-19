import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import Web3 from 'web3';
import fs from 'fs';
import { CreateAddressPayload } from './address.payload';
import { AddressService } from './address.service';
import { LoggerService, QueryParams } from '../common/';
import { CustomError } from '../../errors/custom.error';

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
  async paginate(@QueryParams(['address']) { options, querys }) {
    this.loggerService.info('paginate:querys:%O', querys);
    return this.addressService.paginate(options, querys);
  }

  /**
   * create
   * @param payload
   * @returns
   */
  @Post()
  async create(@Body() payload: CreateAddressPayload) {
    if (!Web3.utils.isAddress(payload.address)) {
      throw new CustomError({
        statusCode: 422,
        message: 'invalid address',
      });
    }
    payload.address = payload.address.toLowerCase();
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

  /**
   * readNoficationFile
   * @param payload
   * @returns
   */
  @Get('/test/readNoficationFile')
  async readNoficationFile() {
    const result = fs.readFileSync('logs/notification.txt', {
      encoding: 'utf8',
      flag: 'r',
    });
    return result;
  }
}
