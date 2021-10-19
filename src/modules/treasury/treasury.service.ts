import { Injectable } from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Treasury } from './treasury.entity';

@Injectable()
export class TreasuryService {
  constructor(
    @InjectRepository(Treasury)
    private readonly treasuryRepository: Repository<Treasury>,
  ) {}

  /**
   * paginate
   * 
   * @param pagination
   * @param querys
   * @returns
   */
  async paginate(
    pagination: IPaginationOptions,
    querys,
  ): Promise<Pagination<Treasury>> {
    return paginate<Treasury>(this.treasuryRepository, pagination, {
      order: {
        created_at: 'DESC',
      },
      where: querys,
    });
  }

  /**
   * create
   * @param payload
   * @returns
   */
  async create(payload) {
    return await this.treasuryRepository.save(payload);
  }

  /**
   * find
   * @param options
   * @returns
   */
  async find(options) {
    return await this.treasuryRepository.find(options);
  }

  /**
   * findOne
   * @param options
   * @returns
   */
  async findOne(options) {
    return await this.treasuryRepository.findOne(options);
  }
}
