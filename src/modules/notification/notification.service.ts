import { Injectable } from '@nestjs/common';
import md5 from 'md5';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  /**
   * create
   * @param payload
   * @returns
   */
  async create(payload) {
    try {
      payload.hash = md5(JSON.stringify(payload.content));
      console.log('payload.hash ', payload.hash);
      return await this.notificationRepository.save(payload);
    } catch (error) {
      if (error.code === '23505') {
        return;
        // ignore duplicate key value violates unique constraint "address_contract_updated"
      }

      throw error;
      //
    }
  }

  /**
   * paginate
   * @param options
   * @returns
   */
  async paginate(
    pagination: IPaginationOptions,
    querys,
  ): Promise<Pagination<Notification>> {
    return paginate<Notification>(this.notificationRepository, pagination, {
      order: {
        created_at: 'DESC',
      },
      where: querys,
    });
  }
}
