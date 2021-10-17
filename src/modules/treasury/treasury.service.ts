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
   * @param options
   * @returns
   */
  async paginate(options: IPaginationOptions): Promise<Pagination<Treasury>> {
    return paginate<Treasury>(this.treasuryRepository, options, {
      order: {
        created_at: 'DESC',
      },
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
