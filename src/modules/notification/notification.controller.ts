import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { LoggerService, QueryParams } from '../common/';
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
  async paginate(@QueryParams([]) { options, querys }) {
    this.loggerService.info('paginate:querys:%O', querys);
    return this.notificationService.paginate(options, querys);
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
