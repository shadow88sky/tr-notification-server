import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { LoggerService } from '../common/';
import { CreateNotificationPayload } from './notification.payload';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly loggerService: LoggerService,
  ) {}
  /**
   * paginate
   * @returns
   */
  @Get()
  async paginate() {
    this.loggerService.info('paginate');
    return this.notificationService.paginate({ page: 1, limit: 10 });
  }

  /**
   * create
   * @param payload
   * @returns
   */
  @Post()
  async create(@Body() payload: CreateNotificationPayload) {
    const result = await this.notificationService.create(payload);
    return result;
  }

  /**
   * create
   * @param payload
   * @returns
   */
  @Post()
  async createMany(@Body() payload: CreateNotificationPayload[]) {
    const result = await this.notificationService.create(payload);
    return result;
  }
}
