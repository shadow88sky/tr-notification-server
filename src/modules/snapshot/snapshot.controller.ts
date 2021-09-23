import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhookPayload } from './proposal.payload';

import { SnapshotService } from './snapshot.service';

@Controller('snapshot')
@ApiTags('Snapshot')
export class SnapshotController {
  constructor(private readonly snapshotService: SnapshotService) {}

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

    const id = payload.id.split('/')[1];
    const response = await this.snapshotService.querySnapshotProposals({
      id,
    });

    return this.snapshotService.handleWebhook(response.proposal);
  }
}
