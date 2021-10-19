import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from './../config';
import { App } from './app.entity';

@Injectable()
export class AppService {
  constructor(
    private config: ConfigService,
    @InjectRepository(App)
    private readonly appRepository: Repository<App>,
  ) {}

  root(): string {
    return this.config.get('APP_URL');
  }

  /**
   * findOne
   * @param options
   * @returns
   */
  async findOne(options) {
    return await this.appRepository.findOne(options);
  }

  /**
   * find
   * @param options
   * @returns
   */
  async find(options) {
    return await this.appRepository.find(options);
  }
}
