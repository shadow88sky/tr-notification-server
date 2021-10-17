import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScriptService } from './script.service';

@Controller('script')
@ApiTags('Script')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}
  /**
   * initAddress
   * @returns
   */
  @Get('initAddress')
  async initAddress() {
    await this.scriptService.initAddress();
  }
}
