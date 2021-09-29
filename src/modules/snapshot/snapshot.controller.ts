import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomError } from '../../errors';
import { WebhookPayload } from './proposal.payload';
import { LoggerService, QueryParams } from '../common/';
import { SnapshotService } from './snapshot.service';

@Controller('snapshot')
@ApiTags('Snapshot')
export class SnapshotController {
  constructor(
    private readonly snapshotService: SnapshotService,
    private readonly loggerService: LoggerService,
  ) {}

  /**
   *
   * @returns
   */
  @Post('webhook')
  async webhook(@Body() payload: WebhookPayload): Promise<any> {
    /**
     {
          id: 'proposal/QmZ21uS8tVucpaNq2LZCbZUmHhYYXunC1ZS2gPDNWwPWD9',
          event: 'proposal/created',
          space: 'yam.eth',
          expire: 1620947058
     }
     */

    this.loggerService.info('body:payload:%O', payload);
    const id = payload.id.split('/')[1];
    if (!id) throw new CustomError('id not found');
    const response = await this.snapshotService.querySnapshotProposals({
      id,
    });

    return this.snapshotService.handleWebhook(response.proposal);
  }

  /**
   * paginate
   * @returns
   */
  @Get()
  async paginate(@QueryParams() { options }) {
    this.loggerService.info('query:paginate:%O', options);
    return this.snapshotService.paginate(options);
  }
}
