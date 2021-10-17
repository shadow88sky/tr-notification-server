import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { LoggerService } from '../common/';
import { CreateCategoryPayload } from './category.payload';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly loggerService: LoggerService,
  ) {}
  /**
   * create
   * @param payload
   * @returns
   */
  @Post()
  async create(@Body() payload: CreateCategoryPayload) {
    this.loggerService.info(`create category:${payload}`);
    const result = await this.categoryService.create(payload);

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
    return this.categoryService.paginate({ page: 1, limit: 10 });
  }
}
