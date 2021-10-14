import { Injectable } from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * paginate
   * @param options
   * @returns
   */
  async paginate(options: IPaginationOptions): Promise<Pagination<Category>> {
    return paginate<Category>(this.categoryRepository, options);
  }

  /**
   * create
   * @param payload
   * @returns
   */
  async create(payload) {
    return await this.categoryRepository.save(payload);
  }

  /**
   * find
   * @param options
   * @returns
   */
  async find(options) {
    return await this.categoryRepository.find(options);
  }

  /**
   * findOne
   * @param options
   * @returns
   */
  async findOne(options) {
    return await this.categoryRepository.findOne(options);
  }
}
