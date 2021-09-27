import { Injectable } from '@nestjs/common';
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
}
