import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Address } from './address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  /**
   * create
   * @param payload
   * @returns
   */
  async create(payload) {
    return await this.addressRepository.save(payload);
  }

  /**
   * paginate
   * @param options
   * @returns
   */
  async paginate(
    pagination: IPaginationOptions,
    querys,
  ): Promise<Pagination<Address>> {
    return paginate<Address>(this.addressRepository, pagination, {
      relations: ['treasury'],
      order: {
        created_at: 'DESC',
      },
      where: querys,
    });
  }

  /**
   * find
   * @param options
   * @returns
   */
  async find(options) {
    return await this.addressRepository.find(options);
  }

  /**
   * findOne
   * @param options
   * @returns
   */
  async findOne(options) {
    return await this.addressRepository.findOne(options);
  }

  /**
   * update
   * @param conditions
   *
   * @param payload
   * @returns
   */
  async update(conditions, payload) {
    return await this.addressRepository.update(conditions, payload);
  }
}
